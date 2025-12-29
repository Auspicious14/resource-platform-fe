import React, { useState, useEffect } from "react";
import { useProjectState } from "../context";
import { Button } from "@/components/Buttons";
import { Lightbulb, Lock, Unlock, AlertCircle, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneTitle: string;
  hints: string[];
  difficultyMode: "GUIDED" | "STANDARD" | "HARDCORE";
  projectId: string;
  milestoneNumber: number;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  milestoneTitle,
  hints,
  difficultyMode,
  projectId,
  milestoneNumber,
}) => {
  const { requestAIHint, getOneProject } = useProjectState();
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [activeHints, setActiveHints] = useState<string[]>(hints);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setActiveHints(hints);
  }, [hints]);

  // Reset unlocked count and handle scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setUnlockedCount(0);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, milestoneTitle]);

  if (!isOpen) return null;

  const canUnlockMore = unlockedCount < activeHints.length;
  const isHardcore = difficultyMode === "HARDCORE";

  const handleUnlockNext = () => {
    if (canUnlockMore && !isHardcore) {
      setUnlockedCount((prev) => prev + 1);
    }
  };

  const handleGenerateAIHint = async () => {
    if (isHardcore) return;
    setIsGenerating(true);
    try {
      const newHint = await requestAIHint(
        projectId,
        milestoneNumber,
        difficultyMode
      );
      // Refresh global state so hint appears in milestones tab permanently
      await getOneProject(projectId);

      setActiveHints((prev) => [...prev, newHint]);
      setUnlockedCount((prev) => prev + 1);
    } catch (error) {
      // Error handled in context
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Lightbulb size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Hints: {milestoneTitle}</h2>
              <p className="text-amber-100 text-sm opacity-90">
                Unlock clues to help you progress.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isHardcore ? (
            <div className="bg-red-50 p-5 rounded-2xl flex items-start gap-4 border border-red-100">
              <div className="p-2 bg-red-100 rounded-xl text-red-600">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-red-900">Hints Restricted</h4>
                <p className="text-sm text-red-700 leading-relaxed mt-1">
                  You are building in Hardcore mode. Hints are disabled to
                  maintain the challenge and earn maximum XP rewards.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={onClose}
                >
                  I've got this!
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {activeHints.map((hint, index) => {
                  const isUnlocked = index < unlockedCount;
                  return (
                    <div
                      key={index}
                      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isUnlocked
                          ? "bg-white border-amber-200 shadow-sm"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div className="p-4 flex items-start gap-4">
                        <div
                          className={`mt-1 p-2 rounded-xl shrink-0 transition-colors ${
                            isUnlocked
                              ? "bg-amber-100 text-amber-600"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {isUnlocked ? (
                            <Unlock size={18} />
                          ) : (
                            <Lock size={18} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest ${
                                isUnlocked ? "text-amber-600" : "text-gray-400"
                              }`}
                            >
                              {index < hints.length
                                ? `Hint #${index + 1}`
                                : "AI Generated Hint"}
                            </span>
                          </div>
                          <AnimatePresence mode="wait">
                            {isUnlocked ? (
                              <motion.p
                                key="unlocked"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="text-sm text-gray-700 leading-relaxed"
                              >
                                {hint}
                              </motion.p>
                            ) : (
                              <p
                                key="locked"
                                className="text-sm text-gray-400 italic"
                              >
                                This hint is currently locked.
                              </p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {(canUnlockMore || !isGenerating) && (
                <div className="pt-4 space-y-3">
                  {canUnlockMore ? (
                    <Button
                      onClick={handleUnlockNext}
                      className="w-full h-12 gap-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 transition-all active:scale-[0.98]"
                    >
                      <Unlock size={20} />
                      Unlock Next Hint
                    </Button>
                  ) : (
                    <Button
                      onClick={handleGenerateAIHint}
                      isLoading={isGenerating}
                      disabled={isGenerating}
                      className="w-full h-12 gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                    >
                      <Zap size={20} />
                      {activeHints.length === 0
                        ? "Generate AI Hint"
                        : "Request New AI Hint"}
                    </Button>
                  )}
                  <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
                    {difficultyMode === "GUIDED"
                      ? "Free hints in Guided mode"
                      : "Hints reduce your potential XP reward"}
                  </p>
                </div>
              )}

              {!canUnlockMore && hints.length > 0 && (
                <div className="text-center py-4 text-gray-400 text-sm font-medium">
                  All hints for this milestone are unlocked.
                </div>
              )}

              {activeHints.length === 0 && !isGenerating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Lightbulb size={32} />
                  </div>
                  <p className="text-gray-400 text-sm italic">
                    No pre-defined hints. Use the button above to generate one!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
