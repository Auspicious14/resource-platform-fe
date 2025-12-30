import React, { useState, useEffect, useRef } from "react";
import { X, Play, Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
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
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  indentOnInput,
  LanguageDescription,
} from "@codemirror/language";
import { searchKeymap } from "@codemirror/search";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { useProjectState } from "../context";

interface CodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  language: string;
  projectId?: string;
  milestoneId?: string;
  onSubmit?: (code: string) => Promise<void>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  isOpen,
  onClose,
  title,
  language,
  projectId,
  milestoneId,
  onSubmit,
}) => {
  const { submitCode, isLoading: isApiLoading } = useProjectState();
  const [code, setCode] = useState("// Start coding here...\n");
  const [review, setReview] = useState<any>(null);
  const [showReview, setShowReview] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const getLanguageExtension = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "javascript":
      case "js":
      case "typescript":
      case "ts":
        return javascript();
      case "python":
      case "py":
        return python();
      case "html":
        return html();
      case "css":
        return css();
      case "rust":
        return rust();
      default:
        return javascript();
    }
  };

  useEffect(() => {
    if (!isOpen || !editorRef.current) return;

    // Create the editor view if it doesn't exist
    if (!viewRef.current) {
      const state = EditorState.create({
        doc: code,
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
          getLanguageExtension(language),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              setCode(update.state.doc.toString());
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
          EditorView.theme({
            "&": {
              height: "100%",
              backgroundColor: "#030712",
            },
            ".cm-scroller": {
              overflow: "auto",
              fontFamily: "JetBrains Mono, Fira Code, monospace",
            },
          }),
        ],
      });

      const view = new EditorView({
        state,
        parent: editorRef.current,
      });

      viewRef.current = view;
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setShowReview(false);

    try {
      const data = await submitCode({
        projectId,
        milestoneId,
        code,
        language,
      });

      if (data.success) {
        setReview(data.data.review);
        setShowReview(true);

        if (data.data.review.meetsRequirements) {
          if (onSubmit) await onSubmit(code);
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-gray-400">Web-based Code Editor</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={isApiLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {isApiLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Submit Code
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="ml-4 font-mono">
                  index.{language === "javascript" ? "js" : language}
                </span>
              </div>
            </div>

            <div
              ref={editorRef}
              className="flex-1 overflow-hidden bg-[#030712] border-t border-gray-800"
            />
          </div>

          {/* Review Panel */}
          {showReview && review && (
            <div className="w-96 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">
                      Code Review
                    </h3>
                    {review.meetsRequirements ? (
                      <CheckCircle className="text-green-500" size={24} />
                    ) : (
                      <AlertCircle className="text-yellow-500" size={24} />
                    )}
                  </div>

                  {/* Score */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        Quality Score
                      </span>
                      <span className="text-2xl font-bold text-white">
                        {review.score}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          review.score >= 80
                            ? "bg-green-500"
                            : review.score >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${review.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div
                    className={`p-4 rounded-lg mb-6 ${
                      review.meetsRequirements
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-yellow-500/10 border border-yellow-500/20"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        review.meetsRequirements
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {review.meetsRequirements
                        ? "✓ Meets milestone requirements"
                        : "⚠ Needs improvements to meet requirements"}
                    </p>
                  </div>
                </div>

                {/* Strengths */}
                {review.strengths && review.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-green-400 mb-3">
                      ✓ Strengths
                    </h4>
                    <ul className="space-y-2">
                      {review.strengths.map((strength: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-300 flex items-start gap-2"
                        >
                          <span className="text-green-500 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {review.improvements && review.improvements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-yellow-400 mb-3">
                      ⚡ Improvements
                    </h4>
                    <ul className="space-y-2">
                      {review.improvements.map(
                        (improvement: string, idx: number) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-300 flex items-start gap-2"
                          >
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>{improvement}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Security Issues */}
                {review.securityIssues && review.securityIssues.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-red-400 mb-3">
                      🔒 Security Concerns
                    </h4>
                    <ul className="space-y-2">
                      {review.securityIssues.map(
                        (issue: string, idx: number) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-300 flex items-start gap-2"
                          >
                            <span className="text-red-500 mt-1">•</span>
                            <span>{issue}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {review.meetsRequirements && (
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                  >
                    Mark Milestone Complete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
