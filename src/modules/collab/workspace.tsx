"use client";

import React, { useState } from "react";
import CollaborativeEditor from "./editor";
import VideoChat from "./video-chat";
import { Maximize2, Minimize2, Users, Code, Video } from "lucide-react";

interface SharedWorkspaceProps {
  projectId: string;
  projectTitle: string;
  user: any;
}

export default function SharedWorkspace({
  projectId,
  projectTitle,
  user,
}: SharedWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"editor" | "split" | "video">(
    "split"
  );

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950 overflow-hidden">
      {/* Workspace Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-lg shadow-blue-500/20 shadow-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md">
              Shared Workspace: {projectTitle}
            </h1>
            <p className="text-[10px] text-gray-500 font-medium">
              TEAM COLLABORATION ACTIVE
            </p>
          </div>
        </div>

        <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "editor"
                ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Code className="h-3.5 w-3.5" /> Editor
          </button>
          <button
            onClick={() => setActiveTab("split")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "split"
                ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Maximize2 className="h-3.5 w-3.5" /> Split
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "video"
                ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Video className="h-3.5 w-3.5" /> Meeting
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 flex overflow-hidden relative">
        <div
          className={`p-4 transition-all duration-300 ${
            activeTab === "split" || activeTab === "editor"
              ? "flex-1 block"
              : "hidden"
          }`}
        >
          <CollaborativeEditor projectId={projectId} user={user} />
        </div>

        <div
          className={`p-4 transition-all duration-300 ${
            activeTab === "split"
              ? "w-[400px] border-l dark:border-gray-800"
              : activeTab === "video"
              ? "flex-1"
              : "hidden"
          }`}
        >
          <VideoChat projectId={projectId} user={user} />

          {/* Active Members Sidebar (Mock) */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-tighter">
              Team Members
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-blue-500/20">
                  {user.firstName?.[0] || "Y"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    You
                  </span>
                  <span className="text-[10px] text-green-500 font-medium">
                    Coding
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                  JS
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    John Smith
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Searching...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Workspace Footer / Status Bar */}
      <footer className="px-4 py-1.5 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>{" "}
            Connected
          </div>
          <div className="text-[10px] font-bold text-gray-500">
            Latency: <span className="text-blue-600">24ms</span>
          </div>
        </div>
        <div className="text-[10px] font-bold text-gray-400">
          DEV DRILL COLLAB v1.0
        </div>
      </footer>
    </div>
  );
}
