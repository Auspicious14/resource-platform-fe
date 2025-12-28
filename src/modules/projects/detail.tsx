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
import { CodeEditor } from "./components/CodeEditor";

export const ProjectDetailPage = ({
  project: initialProject,
}: {
  project: IProject;
}) => {
  const [project, setProject] = useState<IProject>(initialProject);
  const [activeTab, setActiveTab] = useState<
    "overview" | "milestones" | "resources" | "solutions"
  >("overview");
  const [difficultyMode, setDifficultyMode] =
    useState<DifficultyMode>("STANDARD");
  const [showChatModal, setShowChatModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [selectedMilestoneForHint, setSelectedMilestoneForHint] =
    useState<any>(null);
  const { startProject, completeMilestone, getOneProject } = useProjectState();

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
    try {
      await startProject(project.id, difficultyMode);
      // Refresh local state using context's getOneProject to ensure we stay in sync
      const updated = await getOneProject(project.id);
      if (updated) setProject(updated);
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

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 transition-colors duration-300">
      {/* Project Hero Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="mb-8 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-2">
            <a
              href="/projects"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Projects
            </a>
            <ChevronRight size={12} />
            <span className="text-gray-900 dark:text-gray-100">
              {project.title}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant={
                    project.difficultyLevel === "BEGINNER"
                      ? "success"
                      : project.difficultyLevel === "INTERMEDIATE"
                      ? "default"
                      : "destructive"
                  }
                  className="dark:opacity-80"
                >
                  {project.difficultyLevel}
                </Badge>
                {project.technologies?.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                {project.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-3xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium border-t border-gray-50 dark:border-gray-800 pt-8">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-500" />
                  <span>
                    {project.submissionCount || 0} developers building this
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-purple-500" />
                  <span>Estimated: 12-15 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-green-500" />
                  <span>{project.milestones?.length || 0} Milestones</span>
                </div>
              </div>
            </div>

            <Card className="w-full lg:w-80 shadow-xl border-blue-100 dark:border-gray-800 ring-4 ring-blue-50/50 dark:ring-gray-800/50">
              <div className="aspect-video relative">
                <img
                  src={`https://placehold.co/600x400/3b82f6/white?text=${project.title}`}
                  className="w-full h-full object-cover rounded-t-xl"
                  alt={project.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="flex items-center gap-2 text-white">
                    <img
                      src={
                        project.createdBy?.avatarUrl ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Author"
                      }
                      className="w-6 h-6 rounded-full border border-white/20"
                    />
                    <span className="text-xs font-bold">
                      By {project.createdBy?.firstName || "System"}
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                    Select Difficulty Mode
                  </div>
                  <DifficultySelector
                    selectedMode={difficultyMode}
                    onModeChange={setDifficultyMode}
                    progressByMode={progressByModeCalculated as any}
                  />
                </div>
                <Button
                  className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
                  onClick={handleStartProject}
                >
                  {isProjectStartedInCurrentMode
                    ? "Resume Project"
                    : "Start Project"}
                </Button>
                <div className="mt-4 flex justify-center gap-4">
                  <button className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Share2 size={20} />
                  </button>
                  <button className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <MessageSquare size={20} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
          {[
            { id: "overview", label: "Overview", icon: FileText },
            { id: "milestones", label: "Milestones", icon: Trophy },
            { id: "resources", label: "Learning Resources", icon: BookOpen },
            { id: "solutions", label: "Community Solutions", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 min-w-0">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Target className="text-blue-600" /> Project Objectives
                  </h2>
                  <ul className="prose prose-blue max-w-none text-gray-600">
                    {objectives.map((obj, index) => (
                      <li key={`${obj}-${index}`}>{obj}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Code2 className="text-purple-600" /> Technology
                    Requirements
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.technologies?.map((tech) => (
                      <Card
                        key={tech}
                        className="p-4 flex items-center gap-3 bg-white border-gray-100 shadow-none"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                          <Code2 size={16} />
                        </div>
                        <span className="font-bold text-gray-700">{tech}</span>
                      </Card>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === "milestones" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Project Milestones
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Track your progress and complete the project step by step.
                    </p>
                  </div>
                  <div className="flex-1 max-w-xs">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{progressByModeCalculated[difficultyMode]}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${progressByModeCalculated[difficultyMode]}%`,
                        }}
                        className={`h-full ${
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

                <div className="bg-blue-50 p-6 rounded-2xl mb-8 flex items-start gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-xl">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-1">
                      Building in {difficultyMode} Mode
                    </h3>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      {difficultyMode === "GUIDED"
                        ? "Detailed steps & unlimited AI hints"
                        : difficultyMode === "STANDARD"
                        ? "Milestones only, moderate AI help"
                        : "Minimal info, restricted AI hints"}
                      . Follow each milestone in order to build a solid
                      foundation.
                    </p>
                  </div>
                </div>

                <div className="relative space-y-8 before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
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
                            className={`absolute left-0 top-0 w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-bold text-xl transition-all shadow-sm ${
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : "bg-white border-gray-100 text-gray-400 group-hover:border-blue-500 group-hover:text-blue-600"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={32} /> : idx + 1}
                          </div>
                          <Card
                            className={`transition-shadow ${
                              isCompleted
                                ? "border-green-100 bg-green-50/20"
                                : "border-gray-100 shadow-none hover:shadow-md"
                            }`}
                          >
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle
                                    className={`text-xl transition-colors ${
                                      isCompleted
                                        ? "text-green-900"
                                        : "group-hover:text-blue-600"
                                    }`}
                                  >
                                    {m.title}
                                  </CardTitle>
                                  <CardDescription className="mt-2">
                                    {m.description}
                                  </CardDescription>
                                </div>
                                {!isCompleted && (
                                  <Lock size={18} className="text-gray-300" />
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-4 mt-4">
                                {!isCompleted && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="gap-2"
                                      onClick={() => {
                                        setSelectedMilestoneForHint(m);
                                        setShowHintModal(true);
                                      }}
                                    >
                                      <HelpCircle size={14} /> Get Hint
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="gap-2"
                                      onClick={() =>
                                        handleCompleteMilestone(m.id)
                                      }
                                    >
                                      <CheckCircle2 size={14} /> Mark Complete
                                    </Button>
                                  </>
                                )}
                                {isCompleted && (
                                  <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                    <CheckCircle2 size={16} /> Completed
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
                    className="group hover:border-blue-200 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl ${
                              res.type === "VIDEO"
                                ? "bg-red-50 text-red-600"
                                : res.type === "ARTICLE"
                                ? "bg-blue-50 text-blue-600"
                                : res.type === "COURSE"
                                ? "bg-purple-50 text-purple-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {res.type === "VIDEO" ? (
                              <PlayCircle size={24} />
                            ) : res.type === "ARTICLE" ? (
                              <FileText size={24} />
                            ) : res.type === "COURSE" ? (
                              <Trophy size={24} />
                            ) : (
                              <BookOpen size={24} />
                            )}
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {res.type}
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {res.title}
                            </h3>
                          </div>
                        </div>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
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
                className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                  <Users size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Community Solutions
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">
                  Be the first to submit a solution for this project! You'll
                  earn double XP and a "Pioneer" badge.
                </p>
                <Button variant="outline" className="h-12 px-8">
                  Submit Your Solution
                </Button>
              </motion.div>
            )}
          </div>

          {/* AI Guide Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <Card className="bg-white border-blue-100 shadow-xl shadow-blue-500/5 overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                    <Layout size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Cloud Editor</h3>
                    <p className="text-xs text-gray-500">
                      Build in your browser
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  Optional in-browser IDE with pre-configured test environment
                  for this project.
                </p>
                <Button
                  onClick={() => setShowCodeEditor(true)}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold h-11 rounded-xl shadow-lg shadow-gray-200"
                >
                  Launch Web Editor
                </Button>
              </CardContent>
            </Card>

            <Card className="sticky top-8 bg-gray-900 border-none overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-lg animate-pulse">
                    <BrainCircuit size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      AI Guide
                    </CardTitle>
                    <CardDescription className="text-blue-400/80 font-medium">
                      Ready to help you build
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-400 text-sm leading-relaxed">
                  I understand this project's architecture and the current
                  difficulty mode. Ask me anything!
                </p>
                <div className="space-y-2">
                  {[
                    "How do I get started?",
                    "Explain the tech stack",
                    "Need a hint for Milestone 1",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setShowChatModal(true)}
                      className="w-full text-left p-3 rounded-xl bg-gray-800 border border-gray-700 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:border-blue-500/50 transition-all flex items-center justify-between group"
                    >
                      {q}
                      <ChevronRight
                        size={14}
                        className="text-gray-500 group-hover:text-blue-400"
                      />
                    </button>
                  ))}
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11"
                  onClick={() => setShowChatModal(true)}
                >
                  Open Chat Interface
                </Button>
              </CardContent>
            </Card>

            <div className="mt-8">
              <GitHubIntegration
                projectId={project.id}
                initialRepoUrl={project.starterRepoUrl}
                onRepoLinked={(url) => {
                  setProject((prev) => ({ ...prev, starterRepoUrl: url }));
                }}
              />
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

      {showHintModal && selectedMilestoneForHint && (
        <HintModal
          isOpen={showHintModal}
          onClose={() => setShowHintModal(false)}
          milestoneTitle={selectedMilestoneForHint.title}
          hints={selectedMilestoneForHint.hints || []}
          difficultyMode={difficultyMode}
        />
      )}

      {showCodeEditor && (
        <CodeEditor
          isOpen={showCodeEditor}
          onClose={() => setShowCodeEditor(false)}
          title={project.title}
          language="javascript"
        />
      )}
    </div>
  );
};
