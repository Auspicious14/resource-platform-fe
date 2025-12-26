import React from "react";
import { Zap, Shield, Dna, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export type DifficultyMode = "GUIDED" | "STANDARD" | "HARDCORE";

interface DifficultySelectorProps {
  selectedMode: DifficultyMode;
  onModeChange: (mode: DifficultyMode) => void;
  progressByMode?: Record<DifficultyMode, number>; // Percentage progress per mode
}

const modes = [
  {
    id: "GUIDED",
    label: "Guided",
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    activeColor: "bg-blue-600",
    description:
      "Perfect for beginners. Includes step-by-step instructions, code snippets, and unlimited AI-powered hints to ensure you never get stuck.",
    features: [
      "Step-by-step guidance",
      "Code snippets included",
      "Unlimited AI hints",
      "Detailed explanations",
    ],
  },
  {
    id: "STANDARD",
    label: "Standard",
    icon: Shield,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    activeColor: "bg-purple-600",
    description:
      "The intended experience. Focuses on milestones and high-level requirements. AI assistance is available but limited to architectural advice.",
    features: [
      "Milestone-based tracking",
      "Requirement docs only",
      "Limited AI assistance",
      "Standard XP rewards",
    ],
  },
  {
    id: "HARDCORE",
    label: "Hardcore",
    icon: Dna,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    activeColor: "bg-orange-600",
    description:
      "For the pros. Only the final objective is given. No hints, no guidance. Maximum XP rewards and exclusive badges upon completion.",
    features: [
      "Final objective only",
      "Zero AI assistance",
      "No hints allowed",
      "2x XP & Elite Badges",
    ],
  },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedMode,
  onModeChange,
  progressByMode = { GUIDED: 0, STANDARD: 0, HARDCORE: 0 },
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const Icon = mode.icon;
          const progress = progressByMode[mode.id as DifficultyMode] || 0;

          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id as DifficultyMode)}
              className={`relative flex flex-col p-4 rounded-2xl border-2 transition-all text-left group ${
                isSelected
                  ? `${mode.borderColor} ${mode.bgColor} ring-4 ring-opacity-50 ring-offset-0`
                  : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
              style={{
                boxShadow: isSelected
                  ? `0 0 20px -5px ${
                      mode.id === "GUIDED"
                        ? "#3b82f6"
                        : mode.id === "STANDARD"
                        ? "#9333ea"
                        : "#ea580c"
                    }40`
                  : "none",
              }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className={`p-2.5 rounded-xl transition-colors ${
                    isSelected
                      ? `${mode.activeColor} text-white`
                      : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold text-lg ${
                        isSelected ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {mode.label}
                    </span>
                    {progress > 0 && (
                      <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {progress}% Done
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    {mode.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 pt-3 border-t border-gray-200/50 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {mode.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[10px] font-medium text-gray-600"
                      >
                        <CheckCircle2 size={12} className={mode.color} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
