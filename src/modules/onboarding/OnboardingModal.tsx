"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Target,
  Code2,
  Award,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Search,
  BookOpen,
  Laptop,
} from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components";
import toast from "react-hot-toast";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: "Welcome to Devdrill",
    description:
      "Let's personalize your learning experience. We'll help you find the best projects to level up your skills.",
    icon: Rocket,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Learning Goals",
    description:
      "What are you looking to achieve? This helps us recommend the right paths.",
    icon: Target,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "Tech Preferences",
    description: "Select the technologies you're interested in mastering.",
    icon: Code2,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Skill Assessment",
    description: "Rate your current experience level in software engineering.",
    icon: Award,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
];

const goals = [
  "Build a Portfolio",
  "Prepare for Interviews",
  "Learn New Tech",
  "Improve Code Quality",
  "Switch Careers",
  "Just for Fun",
];

const technologies = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Python",
  "Tailwind CSS",
  "Prisma",
  "SQL",
  "Docker",
  "AWS",
  "React Native",
  "Go",
  "Rust",
  "Vue.js",
];

const skillLevels = [
  {
    label: "Beginner",
    description: "Just starting my coding journey",
    icon: Laptop,
  },
  {
    label: "Intermediate",
    description: "Have built some projects before",
    icon: Code2,
  },
  {
    label: "Advanced",
    description: "Experienced developer looking for challenges",
    icon: Sparkles,
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success("Profile updated! Redirecting to your recommendations.");
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center py-8">
            <div
              className={`w-20 h-20 ${steps[0].bg} rounded-3xl flex items-center justify-center mx-auto mb-6`}
            >
              <Rocket className={`w-10 h-10 ${steps[0].color}`} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {steps[0].title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
              {steps[0].description}
            </p>
          </div>
        );
      case 1:
        return (
          <div className="py-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Target className="text-purple-600" />
              {steps[1].title}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedGoals.includes(goal)
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                      : "border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{goal}</span>
                    {selectedGoals.includes(goal) && <Check size={16} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="py-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <Code2 className="text-green-600" />
              {steps[2].title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Select at least 3 technologies.
            </p>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    selectedTech.includes(tech)
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-300"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="py-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Award className="text-amber-600" />
              {steps[3].title}
            </h2>
            <div className="space-y-4">
              {skillLevels.map((level) => (
                <button
                  key={level.label}
                  onClick={() => setSelectedSkill(level.label)}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-6 ${
                    selectedSkill === level.label
                      ? "border-amber-600 bg-amber-50 dark:bg-amber-900/20 shadow-lg shadow-amber-900/5"
                      : "border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      selectedSkill === level.label
                        ? "bg-amber-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}
                  >
                    <level.icon size={24} />
                  </div>
                  <div>
                    <div
                      className={`font-bold text-lg ${
                        selectedSkill === level.label
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {level.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {level.description}
                    </div>
                  </div>
                  {selectedSkill === level.label && (
                    <div className="ml-auto text-amber-600">
                      <Check size={24} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 flex">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-full transition-all duration-500 ${
                  i <= currentStep
                    ? "bg-blue-600"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              />
            ))}
          </div>

          <div className="p-8 md:p-12">
            {renderStep()}

            <div className="mt-12 flex items-center justify-between">
              <button
                onClick={handleBack}
                className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all ${
                  currentStep === 0
                    ? "opacity-0 pointer-events-none"
                    : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <Button
                onClick={handleNext}
                className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20"
                disabled={
                  (currentStep === 1 && selectedGoals.length === 0) ||
                  (currentStep === 2 && selectedTech.length < 3) ||
                  (currentStep === 3 && !selectedSkill)
                }
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
                <ChevronRight size={20} className="ml-2" />
              </Button>
            </div>
          </div>

          {/* Decorative corner element */}
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </div>
  );
};
