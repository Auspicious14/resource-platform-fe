"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  keymap,
  drawSelection,
  highlightActiveLine,
  highlightSpecialChars,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  indentOnInput,
} from "@codemirror/language";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";

interface CollaborativeEditorProps {
  projectId: string;
  initialCode?: string;
  user: any;
}

export default function CollaborativeEditor({
  projectId,
  initialCode = "",
  user,
}: CollaborativeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const isIncomingChange = useRef(false);

  useEffect(() => {
    // Initialize Socket.io
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
      {
        withCredentials: true,
      }
    );
    socketRef.current = socket;

    socket.emit("join-project", projectId);

    socket.on("code-update", (change: any) => {
      if (viewRef.current) {
        isIncomingChange.current = true;
        viewRef.current.dispatch({
          changes: { from: change.from, to: change.to, insert: change.insert },
        });
        isIncomingChange.current = false;
      }
    });

    return () => {
      socket.emit("leave-project", projectId);
      socket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        highlightSpecialChars(),
        history(),
        drawSelection(),
        highlightActiveLine(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        foldGutter(),
        oneDark,
        javascript(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !isIncomingChange.current) {
            update.changes.iterChanges((from, to, fromB, toB, text) => {
              socketRef.current?.emit("code-change", {
                projectId,
                change: { from, to, insert: text.toString() },
              });
            });
          }
        }),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...lintKeymap,
        ]),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => view.destroy();
  }, [initialCode]);

  return (
    <div className="flex flex-col h-full border dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b dark:border-gray-700 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Collaborative Editor
        </span>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>
      <div
        ref={editorRef}
        className="flex-1 overflow-auto bg-[#282c34]"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
