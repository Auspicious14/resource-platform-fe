"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Command,
  Rocket,
  BookOpen,
  User,
  Star,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useProjectState } from "@/modules/projects/context";

export const GlobalSearch = () => {
  const { projects } = useProjectState();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Simple search logic
  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = projects
        .filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.technologies?.some((t) =>
              t.toLowerCase().includes(query.toLowerCase())
            )
        )
        .slice(0, 5);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (projectId: string) => {
    router.push(`/projects/${projectId}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-800/50 hover:bg-blue-800 border border-blue-700/50 rounded-xl text-blue-100 transition-all group"
      >
        <Search
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="text-sm font-medium hidden md:inline">
          Search projects...
        </span>
        <div className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 bg-blue-700/50 border border-blue-600/50 rounded text-[10px] font-bold">
          <Command size={10} /> K
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[10vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
              ref={searchRef}
            >
              <div className="flex items-center p-6 border-b dark:border-gray-800">
                <Search className="text-gray-400 mr-4" size={24} />
                <input
                  autoFocus
                  placeholder="Search for projects, tech stacks, or authors..."
                  className="flex-1 bg-transparent border-none outline-none text-xl text-gray-900 dark:text-white placeholder-gray-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4">
                {query.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="inline-flex p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 mb-4">
                      <Rocket size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Quick Search
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      Try searching for "React", "Fullstack", or "Portfolio"
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-8 max-w-sm mx-auto">
                      {["React", "Next.js", "Python", "Tailwind"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-sm font-medium text-gray-600 dark:text-gray-400"
                        >
                          <Search size={14} className="text-blue-500" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-2">
                    <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                      Project Results ({results.length})
                    </div>
                    {results.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleSelect(project.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 group transition-all text-left"
                      >
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={
                              project.thumbnailUrl ||
                              `https://placehold.co/100x100/3b82f6/white?text=${project.title[0]}`
                            }
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {project.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-500 uppercase tracking-wider">
                            {project.difficultyLevel}
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="inline-flex p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 mb-4">
                      <Search size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      No results found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      Try different keywords or browse categories
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-800 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded shadow-sm">
                      ESC
                    </span>
                    to close
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded shadow-sm">
                      ↵
                    </span>
                    to select
                  </div>
                </div>
                <div>Search by Devdrill</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
