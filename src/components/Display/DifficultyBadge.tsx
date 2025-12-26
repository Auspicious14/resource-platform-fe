"use client";

import React from "react";
import { Badge } from "@/components";
import { Zap, SignalLow, SignalMedium, SignalHigh } from "lucide-react";

interface DifficultyBadgeProps {
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | string;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ level, className }) => {
  const config = {
    BEGINNER: {
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
      icon: SignalLow,
      label: "Beginner"
    },
    INTERMEDIATE: {
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-800",
      icon: SignalMedium,
      label: "Intermediate"
    },
    ADVANCED: {
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-100 dark:border-purple-800",
      icon: SignalHigh,
      label: "Advanced"
    },
    EXPERT: {
      color: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border-rose-100 dark:border-rose-800",
      icon: Zap,
      label: "Expert"
    }
  };

  const current = config[level as keyof typeof config] || config.BEGINNER;
  const Icon = current.icon;

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${current.color} ${className}`}
    >
      <Icon size={12} strokeWidth={3} />
      {current.label}
    </Badge>
  );
};
