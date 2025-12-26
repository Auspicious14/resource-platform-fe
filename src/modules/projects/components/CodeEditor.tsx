import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Save, ChevronRight, Layout, Settings, Download, RotateCcw, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/Buttons";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface CodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  language?: string;
  title: string;
  onSave?: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  isOpen,
  onClose,
  initialCode = "// Start building your solution here...",
  language = "javascript",
  title,
  onSave,
}) => {
  const [code, setCode] = useState(initialCode);
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  if (!isOpen) return null;

  const handleRun = async () => {
    setIsRunning(true);
    setOutput((prev) => [...prev, `> Running code at ${new Date().toLocaleTimeString()}...`]);
    
    // Simulate test execution
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsRunning(false);
    setOutput((prev) => [
      ...prev,
      "✓ Milestone requirements met",
      "✓ Syntax validation passed",
      "✓ All tests passed successfully!",
    ]);
    toast.success("Tests passed!");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) onSave(code);
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Draft saved successfully");
    } finally {
      setIsSaving(false);
    }
  };

  const clearOutput = () => setOutput([]);

  return (
    <div className={`fixed inset-0 z-[110] flex flex-col bg-gray-950 ${isFullScreen ? "p-0" : "p-4 md:p-8"}`}>
      {/* Backdrop for non-fullscreen */}
      {!isFullScreen && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-10" 
          onClick={onClose}
        />
      )}

      {/* Editor Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col w-full h-full bg-[#1e1e1e] ${isFullScreen ? "" : "rounded-3xl border border-gray-800"} overflow-hidden shadow-2xl`}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#181818] border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Layout size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{title}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{language}</span>
                <span className="text-[10px] text-gray-700">•</span>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Auto-save enabled</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
              className="bg-transparent border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 h-9 px-3"
            >
              <Settings size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="bg-transparent border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 h-9 px-3"
            >
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
            <div className="w-px h-6 bg-gray-800 mx-2" />
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold h-9 px-4 rounded-lg gap-2"
            >
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              Save
            </Button>
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-9 px-4 rounded-lg gap-2 shadow-lg shadow-blue-900/20"
            >
              {isRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
              Run Tests
            </Button>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Editor Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer (Simplified) */}
          <div className="hidden md:flex flex-col w-48 bg-[#181818] border-r border-gray-800 py-4">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Explorer</span>
            </div>
            <div className="space-y-1">
              {["index.js", "utils.js", "tests.spec.js"].map((file) => (
                <button
                  key={file}
                  className={`w-full text-left px-6 py-2 text-xs font-medium transition-colors ${
                    file === "index.js" ? "bg-blue-600/10 text-blue-400 border-r-2 border-blue-600" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>
          </div>

          {/* Editor and Output */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={language}
                theme={theme}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 20 },
                  fontFamily: "var(--font-inter)",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Terminal Output */}
            <div className="h-48 bg-[#0f0f0f] border-t border-gray-800 flex flex-col">
              <div className="flex items-center justify-between px-6 py-2 bg-[#181818] border-b border-gray-800">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Terminal Output</span>
                <button 
                  onClick={clearOutput}
                  className="p-1 text-gray-500 hover:text-white transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
              <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 custom-scrollbar">
                {output.length > 0 ? (
                  output.map((line, i) => (
                    <div key={i} className={line.startsWith("✓") ? "text-green-500" : "text-gray-400"}>
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-700 italic">No output. Click "Run Tests" to see results.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Simple RefreshCw component for lucide
import { RefreshCw } from "lucide-react";
