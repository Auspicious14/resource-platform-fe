"use client";
import React, { useState } from "react";
import { IProject, IProjectMilestone } from "./model";
import toast from "react-hot-toast";
import {
  Button,
  Card,
  CardContent,
  Badge,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components";
import { useProjectState } from "./context";
import {
  Clock,
  BookOpen,
  Code2,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  PlayCircle,
  FileText,
  HelpCircle,
  Trophy,
  Users,
  MessageSquare,
  Share2,
  Lock,
  Zap,
  Shield,
  Dna,
  Target,
  BrainCircuit,
  Layout,
} from "lucide-react";
import { motion } from "framer-motion";
import { ChatModal } from "../chat/components/modal";
import {
  DifficultySelector,
  DifficultyMode,
} from "./components/DifficultySelector";
import { HintModal } from "./components/HintModal";
import { GitHubIntegration } from "./components/GitHubIntegration";
import { Modal } from "@/components/Modal";
import { ProjectForm } from "./components/ProjectForm";
import { useAuth } from "../auth/context";
import { Edit } from "lucide-react";
import { CodeEditor } from "./components/CodeEditor";

export const ProjectDetailPage = ({
  project: initialProject,
}: {
  project: IProject;
}) => {
  const { user } = useAuth();
  const [project, setProject] = useState<IProject>(initialProject);
  const [activeTab, setActiveTab] = useState<
    "overview" | "milestones" | "resources" | "solutions"
  >("overview");
  const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>(
    project.userProgress?.difficultyModeChosen || "STANDARD"
  );
  const [showChatModal, setShowChatModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMilestoneForHint, setSelectedMilestoneForHint] =
    useState<IProjectMilestone | null>(null);
  const [selectedMilestoneForEditor, setSelectedMilestoneForEditor] =
    useState<IProjectMilestone | null>(null);
  const { startProject, completeMilestone, getOneProject } = useProjectState();

  // Refresh project data on mount to ensure we have the latest user-specific progress
  React.useEffect(() => {
    const refreshProject = async () => {
      try {
        const updated = await getOneProject(initialProject.id);
        if (updated) setProject(updated);
      } catch (error) {
        console.error("Failed to refresh project data:", error);
      }
    };

    // Only fetch if we're on the client and potentially have a user
    if (typeof window !== "undefined") {
      refreshProject();
    }
  }, [initialProject.id]);

  const isOwner = user?.id === project.createdById || user?.role === "ADMIN";

  const lastUpdated = new Date(project?.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const progressByModeCalculated = React.useMemo(() => {
    const progress: Record<string, number> = {
      GUIDED: 0,
      STANDARD: 0,
      HARDCORE: 0,
    };

    if (project.progressByMode) {
      Object.entries(project.progressByMode).forEach(([mode, data]) => {
        if (project.milestones.length > 0) {
          progress[mode] = Math.round(
            (data.completedMilestones.length / project.milestones.length) * 100
          );
        }
      });
    }
    return progress;
  }, [project.progressByMode, project.milestones]);

  const currentModeProgress = project.progressByMode?.[difficultyMode];
  const isProjectStartedInCurrentMode = !!currentModeProgress;

  const handleStartProject = async () => {
    // If project is already started in this mode, just navigate to milestones
    if (isProjectStartedInCurrentMode) {
      setActiveTab("milestones");
      // Optional: Smooth scroll to milestones section
      document
        .getElementById("tabs-section")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      await startProject(project.id, difficultyMode);
      // Refresh local state using context's getOneProject to ensure we stay in sync
      const updated = await getOneProject(project.id);
      if (updated) setProject(updated);
      setActiveTab("milestones");
      toast.success(`Strategy selected: ${difficultyMode} Mode activated.`);
    } catch (error: any) {
      // Error handled in context
    }
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    try {
      await completeMilestone(project.id, milestoneId, difficultyMode);
      const updated = await getOneProject(project.id);
      if (updated) setProject(updated);
    } catch (error: any) {
      // Error handled in context
    }
  };

  const objectives =
    project.learningObjectives?.filter(
      (obj): obj is string => typeof obj === "string" && obj.trim().length > 0
    ) ?? [];
  console.log({ project, selectedMilestoneForHint });
  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pt-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
            <div className="flex-1 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  className="rounded-full px-4 py-1 border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider bg-blue-50/50 dark:bg-blue-900/20"
                >
                  {project.difficultyLevel}
                </Badge>
                {project.categories?.map((cat) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className="rounded-full px-4 py-1 border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold text-[10px] uppercase tracking-wider bg-gray-50/30 dark:bg-gray-800/30"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                {project.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2 group">
                  <Clock size={14} className="text-blue-500" />
                  {project.estimatedTime || "4-6 Hours"}
                </div>
                <div className="flex items-center gap-2 group">
                  <Users size={14} className="text-purple-500" />
                  {project.submissionCount || 0} Builders
                </div>
                <div className="flex items-center gap-2 group">
                  <Share2 size={14} className="text-orange-500" />
                  Updated {lastUpdated}
                </div>
              </div>
            </div>
          </div>

          <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md -mx-4 px-4">
            <div className="flex gap-4 md:gap-10 overflow-x-auto scrollbar-hide relative border-b border-gray-100 dark:border-gray-800">
              {[
                { id: "overview", label: "Overview", icon: FileText },
                { id: "milestones", label: "Milestones", icon: Trophy },
                { id: "resources", label: "Resources", icon: BookOpen },
                { id: "solutions", label: "Community", icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 pt-6 pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap relative group ${
                    activeTab === tab.id
                      ? "text-blue-600"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <tab.icon
                    size={14}
                    className={
                      activeTab === tab.id
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600 transition-colors"
                    }
                  />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 min-w-0">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 shadow-sm">
                        <Zap size={18} fill="currentColor" />
                      </div>
                      Learning Journey
                    </h2>
                    {project.userProgress && (
                      <Badge
                        variant="outline"
                        className="rounded-full px-4 py-1 border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider"
                      >
                        Active Session
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {["GUIDED", "STANDARD", "HARDCORE"].map((mode) => {
                      const modeProgress =
                        progressByModeCalculated[mode as any] || 0;
                      const isActive =
                        project.userProgress?.difficultyModeChosen === mode;
                      return (
                        <div
                          key={mode}
                          className={`p-6 rounded-3xl border-2 transition-all duration-300 relative group ${
                            isActive
                              ? "bg-blue-50/30 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800 shadow-lg shadow-blue-500/5"
                              : "bg-white border-gray-50 dark:bg-gray-800/20 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-6">
                            <span
                              className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                isActive
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-400"
                              }`}
                            >
                              {mode}
                            </span>
                            {isActive && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                            )}
                          </div>
                          <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-4xl font-black text-gray-900 dark:text-white">
                              {modeProgress}
                            </span>
                            <span className="text-sm font-bold text-gray-400">
                              %
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${modeProgress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                mode === "GUIDED"
                                  ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                  : mode === "STANDARD"
                                  ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                  : "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {project.userProgress && (
                    <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-800/50 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                          <BrainCircuit size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Strategy Active Since
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {new Date(
                              project.userProgress.startedAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <section className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                        <FileText size={18} />
                      </div>
                      Project Brief
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium">
                      {project.description}
                    </p>
                  </section>

                  <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                        <Code2 size={18} />
                      </div>
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech) => (
                        <div
                          key={tech}
                          className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-2 group hover:border-blue-500/30 transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-125 transition-transform" />
                          <span className="text-xs font-black text-gray-700 dark:text-gray-300">
                            {tech}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                        <Target size={18} />
                      </div>
                      Learning Objectives
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {project.learningObjectives?.map((obj, idx) => (
                        <div key={idx} className="flex items-start gap-3 group">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform flex-shrink-0" />
                          <p className="text-gray-600 dark:text-gray-400 text-xs font-medium leading-relaxed">
                            {obj}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeTab === "milestones" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 px-2">
                  <div className="max-w-md">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                      Roadmap to Success
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                      Follow the structured path below. Each milestone is
                      designed to build your skills progressively.
                    </p>
                  </div>
                  <div className="flex-1 max-w-[280px]">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
                      <span>Completion</span>
                      <span className="text-blue-600">
                        {progressByModeCalculated[difficultyMode]}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${progressByModeCalculated[difficultyMode]}%`,
                        }}
                        className={`h-full rounded-full transition-all duration-1000 ${
                          difficultyMode === "GUIDED"
                            ? "bg-blue-500"
                            : difficultyMode === "STANDARD"
                            ? "bg-purple-500"
                            : "bg-orange-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative space-y-10 before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-500/20 before:via-gray-100 before:to-gray-100 dark:before:from-blue-500/20 dark:before:via-gray-800 dark:before:to-gray-800">
                  {project.milestones
                    ?.sort((a, b) => a.milestoneNumber - b.milestoneNumber)
                    .map((m, idx) => {
                      const isCompleted =
                        currentModeProgress?.completedMilestones?.includes(
                          m.id
                        );
                      return (
                        <div key={m.id} className="relative pl-20 group">
                          <div
                            className={`absolute left-0 top-0 w-16 h-16 rounded-[1.5rem] border-4 flex items-center justify-center font-black text-xl transition-all duration-500 z-10 ${
                              isCompleted
                                ? "bg-green-500 border-green-100 dark:border-green-900/30 text-white shadow-lg shadow-green-200 dark:shadow-none"
                                : "bg-white dark:bg-gray-900 border-gray-50 dark:border-gray-800 text-gray-300 dark:text-gray-600 group-hover:border-blue-500 group-hover:text-blue-600 group-hover:shadow-xl group-hover:shadow-blue-500/10"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={28} /> : idx + 1}
                          </div>

                          <Card
                            className={`transition-all duration-500 border-none rounded-[2rem] overflow-hidden ${
                              isCompleted
                                ? "bg-green-50/30 dark:bg-green-900/5 ring-1 ring-green-100 dark:ring-green-900/20 shadow-none"
                                : "bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-none ring-1 ring-gray-100 dark:ring-gray-800 hover:ring-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5"
                            }`}
                          >
                            <CardHeader className="p-8 pb-4">
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2">
                                  <CardTitle
                                    className={`text-2xl font-black tracking-tight transition-colors ${
                                      isCompleted
                                        ? "text-green-900 dark:text-green-400"
                                        : "text-gray-900 dark:text-white group-hover:text-blue-600"
                                    }`}
                                  >
                                    {m.title}
                                  </CardTitle>
                                  <CardDescription className="text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                    {m.description}
                                  </CardDescription>
                                </div>
                                {!isCompleted && (
                                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Lock size={16} className="text-gray-300" />
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4">
                              <div className="flex flex-wrap gap-3 mt-4">
                                {!isCompleted && (
                                  <>
                                    <Button
                                      variant="outline"
                                      className="rounded-xl font-bold gap-2 border-gray-200 dark:border-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                                      onClick={() => {
                                        setSelectedMilestoneForHint(m);
                                        setShowHintModal(true);
                                      }}
                                    >
                                      <HelpCircle size={16} /> Get Guidance
                                    </Button>
                                    <Button
                                      className="rounded-xl font-bold gap-2 bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white transition-all shadow-lg shadow-gray-200 dark:shadow-none"
                                      onClick={() => {
                                        setSelectedMilestoneForEditor(m);
                                        setShowCodeEditor(true);
                                      }}
                                    >
                                      <Code2 size={16} /> Open Lab
                                    </Button>
                                    <Button
                                      variant="transparent"
                                      className="rounded-xl font-bold gap-2 text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all"
                                      onClick={() =>
                                        handleCompleteMilestone(m.id)
                                      }
                                    >
                                      <CheckCircle2 size={16} /> Mark Complete
                                    </Button>
                                  </>
                                )}
                                {isCompleted && (
                                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-200 dark:shadow-none">
                                    <CheckCircle2 size={14} /> Milestone
                                    Mastered
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            )}

            {activeTab === "resources" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {project.resourceLinks?.map((res) => (
                  <Card
                    key={res.id}
                    className="group border-none shadow-xl shadow-gray-200/50 dark:shadow-none ring-1 ring-gray-100 dark:ring-gray-800 rounded-3xl overflow-hidden hover:ring-blue-500/30 transition-all"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                              res.type === "VIDEO"
                                ? "bg-red-50 text-red-600 shadow-sm"
                                : res.type === "ARTICLE"
                                ? "bg-blue-50 text-blue-600 shadow-sm"
                                : res.type === "COURSE"
                                ? "bg-purple-50 text-purple-600 shadow-sm"
                                : "bg-green-50 text-green-600 shadow-sm"
                            }`}
                          >
                            {res.type === "VIDEO" ? (
                              <PlayCircle size={28} />
                            ) : res.type === "ARTICLE" ? (
                              <FileText size={28} />
                            ) : res.type === "COURSE" ? (
                              <Trophy size={28} />
                            ) : (
                              <BookOpen size={28} />
                            )}
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                              {res.type}
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tight">
                              {res.title}
                            </h3>
                          </div>
                        </div>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeTab === "solutions" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800"
              >
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600">
                  <Users size={48} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                  Pioneer the Community
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                  Be the first to submit a solution! You'll earn the{" "}
                  <span className="text-blue-600 font-bold">
                    "Early Explorer"
                  </span>{" "}
                  badge and 2x XP bonus.
                </p>
                <Button className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-200 dark:shadow-none transition-all hover:-translate-y-1">
                  Submit Your Build
                </Button>
              </motion.div>
            )}
          </div>

          {/* SIDEBAR CONTAINER - Unified Sticky behavior */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="lg:sticky lg:top-20 space-y-6 transition-all duration-300">
              {/* Project Main Action Card - Moved from Hero */}
              <Card className="shadow-xl shadow-gray-200/50 dark:shadow-none border-gray-100 dark:border-gray-800 overflow-hidden rounded-[2rem] group hover:shadow-blue-500/10 transition-all duration-500">
                <div className="aspect-[4/3] relative">
                  <img
                    src={
                      project.coverImage ||
                      `https://placehold.co/600x400/3b82f6/white?text=${project.title}`
                    }
                    className="w-full h-full object-cover"
                    alt={project.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={
                            project.createdBy?.avatarUrl ||
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Author"
                          }
                          className="w-10 h-10 rounded-full border-2 border-white/30"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-white/60 uppercase tracking-widest">
                          Creator
                        </span>
                        <span className="text-sm font-bold text-white">
                          {project.createdBy?.firstName || "System"}{" "}
                          {project.createdBy?.lastName || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 bg-white dark:bg-gray-900">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Difficulty Strategy
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9px] font-bold uppercase py-0 px-2 h-5 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                      >
                        AI Guided
                      </Badge>
                    </div>
                    <DifficultySelector
                      selectedMode={difficultyMode}
                      onModeChange={setDifficultyMode}
                      progressByMode={progressByModeCalculated as any}
                    />
                  </div>
                  <Button
                    className="w-full h-14 text-base font-black bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xl shadow-blue-200 dark:shadow-blue-900/30 rounded-2xl transition-all hover:-translate-y-1 active:scale-95"
                    onClick={handleStartProject}
                  >
                    {isProjectStartedInCurrentMode
                      ? "Resume Journey"
                      : "Begin Project"}
                  </Button>

                  {isOwner && (
                    <Button
                      variant="outline"
                      className="w-full mt-4 h-12 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-2xl"
                      onClick={() => setShowEditModal(true)}
                    >
                      <Edit size={16} />
                      Manage Project
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* GitHub Integration Card */}
              {user && (
                <GitHubIntegration
                  projectId={project.id}
                  initialRepoUrl={project.userProgress?.repoUrl}
                  onRepoLinked={(url) => {
                    setProject((prev) => ({
                      ...prev,
                      userProgress: { ...prev.userProgress, repoUrl: url },
                    }));
                  }}
                />
              )}

              {/* AI Guide Premium Card */}
              <Card className="bg-gray-900 dark:bg-gray-950 border-none overflow-hidden shadow-xl rounded-[2rem] relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/30 transition-colors" />
                <CardHeader className="relative z-10 pb-2">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/20">
                    <Zap size={22} fill="currentColor" />
                  </div>
                  <CardTitle className="text-white text-lg font-black">
                    AI Project Guide
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-xs font-medium">
                    Stuck? Get real-time AI assistance for every milestone.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Button
                    variant="transparent"
                    className="w-full text-white hover:text-primary"
                    onClick={() => setShowChatModal(true)}
                  >
                    Ask AI Assistant
                  </Button>
                </CardContent>
              </Card>

              {/* Cloud Editor Card */}
              <Card className="bg-white dark:bg-gray-900 border-none shadow-lg shadow-gray-200/50 dark:shadow-none ring-1 ring-gray-100 dark:ring-gray-800 rounded-[2rem] overflow-hidden group">
                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 mb-3 group-hover:rotate-6 transition-transform">
                    <Layout size={22} />
                  </div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white mb-1">
                    Web Sandbox
                  </h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-5">
                    Build and test your code directly in the browser with our
                    cloud environment.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-gray-100 dark:border-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 font-bold rounded-xl h-11 text-xs transition-colors"
                    onClick={() => setShowCodeEditor(true)}
                  >
                    Launch Editor
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {showChatModal && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          projectId={project.id}
        />
      )}

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
      >
        <ProjectForm
          initialData={project}
          onSuccess={async () => {
            setShowEditModal(false);
            const updated = await getOneProject(project.id);
            if (updated) setProject(updated);
            toast.success("Project updated successfully");
          }}
        />
      </Modal>

      {selectedMilestoneForHint && (
        <HintModal
          isOpen={showHintModal}
          onClose={() => {
            setShowHintModal(false);
            setSelectedMilestoneForHint(null);
          }}
          milestoneTitle={selectedMilestoneForHint.title}
          hints={
            Array.isArray(selectedMilestoneForHint.hints)
              ? {
                  GUIDED: selectedMilestoneForHint.hints,
                  STANDARD: selectedMilestoneForHint.hints,
                  HARDCORE: selectedMilestoneForHint.hints,
                }
              : (selectedMilestoneForHint.hints as Record<
                  "GUIDED" | "STANDARD" | "HARDCORE",
                  string[]
                >) || {
                  GUIDED: [],
                  STANDARD: [],
                  HARDCORE: [],
                }
          }
          difficultyMode={difficultyMode}
          projectId={project.id}
          milestoneNumber={selectedMilestoneForHint.milestoneNumber}
        />
      )}

      {showCodeEditor && (
        <CodeEditor
          isOpen={showCodeEditor}
          onClose={() => {
            setShowCodeEditor(false);
            setSelectedMilestoneForEditor(null);
          }}
          title={selectedMilestoneForEditor?.title || project.title}
          language="javascript"
          projectId={project.id}
          milestoneId={selectedMilestoneForEditor?.id}
          onSubmit={async () => {
            if (selectedMilestoneForEditor) {
              await handleCompleteMilestone(selectedMilestoneForEditor.id);
            }
          }}
        />
      )}
    </div>
  );
};
