"use client";
import React from "react";
import {
  Button,
  Card,
  CardContent,
  Badge,
  CardHeader,
  CardTitle,
} from "@/components";
import {
  Trophy,
  Zap,
  Flame,
  Target,
  Clock,
  ChevronRight,
  Code2,
  BrainCircuit,
  Calendar,
  Layout,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/context";
import { useDashboard } from "./context";

export const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const {
    stats,
    inProgressProjects,
    activities,
    featuredProject,
    isLoading: loading,
  } = useDashboard();

  if (loading)
    return <div className="p-12 text-center">Loading your progress...</div>;

  const calculateProgress = (project: any) => {
    const totalCount = project.project?.milestones?.length || 0;
    if (totalCount === 0) return 0;
    const completedCount = project.completedMilestones?.length || 0;
    return Math.round((completedCount / totalCount) * 100);
  };

  const getActivityIntensity = (date: string) => {
    const count = activities.filter((a) => {
      const activityDate = new Date(a.createdAt).toDateString();
      return activityDate === date;
    }).length;
    if (count === 0) return "bg-gray-100";
    if (count < 2) return "bg-green-200";
    if (count < 4) return "bg-green-400";
    return "bg-green-600";
  };

  const last90Days = [...Array(91)]
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (90 - i));
      return d.toDateString();
    })
    .reverse();

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "Developer"}! 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            {stats?.completedProjects > 0
              ? `You've completed ${stats.completedProjects} projects so far. Keep pushing your limits!`
              : "Ready to start your first project? Browse our collection and start building!"}
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Total XP",
              value: user?.xp || 0,
              icon: Zap,
              color: "text-yellow-500",
              bg: "bg-yellow-50",
            },
            {
              label: "Current Streak",
              value: `${user?.streak || 0} Days`,
              icon: Flame,
              color: "text-orange-500",
              bg: "bg-orange-50",
            },
            {
              label: "Projects Completed",
              value: stats?.completedProjects || 0,
              icon: Target,
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              label: "Skill Level",
              value: user?.skillLevel || "BEGINNER",
              icon: Trophy,
              color: "text-purple-500",
              bg: "bg-purple-50",
            },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Current Projects */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Layout className="text-blue-600" /> Projects in Progress
                </h2>
                <Button
                  variant="transparent"
                  className="text-blue-600 font-bold"
                  onClick={() => router.push("/projects")}
                >
                  <div className="flex gap-2 items-center">
                    <span>Browse All</span>
                    <ChevronRight size={16} />
                  </div>
                </Button>
              </div>

              <div className="space-y-4">
                {inProgressProjects.length > 0 ? (
                  inProgressProjects.map((p) => {
                    const progress = calculateProgress(p);
                    return (
                      <Card
                        key={p.id}
                        className="group hover:border-blue-200 transition-all cursor-pointer"
                        onClick={() => router.push(`/projects/${p.projectId}`)}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-40 aspect-video rounded-xl bg-gray-100 overflow-hidden relative group">
                              <img
                                src={
                                  p.project?.coverImage
                                    ? p.project.coverImage.startsWith("http")
                                      ? p.project.coverImage
                                      : `${process.env.NEXT_PUBLIC_API_URL}${p.project.coverImage}`
                                    : `https://placehold.co/600x400/3b82f6/white?text=${encodeURIComponent(
                                        p.project?.title || "Project"
                                      )}`
                                }
                                alt={p.project?.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  (
                                    e.target as HTMLImageElement
                                  ).src = `https://placehold.co/600x400/3b82f6/white?text=${encodeURIComponent(
                                    p.project?.title || "Project"
                                  )}`;
                                }}
                              />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {p.project?.title}
                                  </h3>
                                  <div className="flex gap-2 mt-1 flex-wrap">
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] uppercase tracking-widest bg-blue-50/50 text-blue-600 border-blue-100"
                                    >
                                      {p.difficultyModeChosen}
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] uppercase tracking-widest"
                                    >
                                      {p.project?.difficultyLevel}
                                    </Badge>
                                    {p.project?.technologies
                                      ?.slice(0, 2)
                                      .map((tech: string) => (
                                        <Badge
                                          key={tech}
                                          variant="outline"
                                          className="text-[10px] uppercase tracking-widest border-gray-100 text-gray-400"
                                        >
                                          {tech}
                                        </Badge>
                                      ))}
                                    {p.project?.categories
                                      ?.slice(0, 1)
                                      .map((cat: string) => (
                                        <Badge
                                          key={cat}
                                          variant="outline"
                                          className="text-[10px] uppercase tracking-widest border-blue-50 text-blue-300 bg-blue-50/10"
                                        >
                                          {cat}
                                        </Badge>
                                      ))}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-blue-600">
                                    {progress}%
                                  </div>
                                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    Progress
                                  </div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  className="bg-blue-600 h-full rounded-full"
                                />
                              </div>
                              <div className="flex justify-between mt-4">
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} /> Started{" "}
                                    {new Date(p.startedAt).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Target size={12} />{" "}
                                    {p.completedMilestones?.length || 0}/
                                    {p.project?.milestones?.length || 0}{" "}
                                    Milestones
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  className="h-8 flex gap-2 items-center"
                                >
                                  <div className="flex gap-2 items-center">
                                    <span>Continue</span>
                                    <ChevronRight size={14} />
                                  </div>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card className="p-12 text-center border-dashed border-2">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <Code2 size={32} />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No projects in progress. Start your first challenge
                        today!
                      </p>
                      <Button onClick={() => router.push("/projects")}>
                        Browse Projects
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </section>

            {/* Featured Project */}
            {featuredProject && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BrainCircuit className="text-purple-600" /> Recommended for
                  You
                </h2>
                <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex-1">
                        <Badge className="bg-white/20 text-white border-none mb-4">
                          Featured Project
                        </Badge>
                        <h3 className="text-2xl font-bold mb-2">
                          {featuredProject.title}
                        </h3>
                        <p className="text-purple-100 mb-6 line-clamp-2">
                          {featuredProject.description}
                        </p>
                        <div className="flex items-center gap-6">
                          <div>
                            <div className="text-3xl font-bold">
                              {featuredProject.difficultyLevel}
                            </div>
                            <div className="text-xs font-bold uppercase tracking-widest text-purple-200">
                              Difficulty
                            </div>
                          </div>
                          <div className="w-px h-10 bg-white/20" />
                          <div>
                            <div className="text-3xl font-bold">
                              {featuredProject.technologies?.length || 0}
                            </div>
                            <div className="text-xs font-bold uppercase tracking-widest text-purple-200">
                              Technologies
                            </div>
                          </div>
                        </div>
                        <Button
                          // variant="primary"
                          className="mt-8 bg-white  !text-purple-600 hover:bg-purple-50 font-bold"
                          onClick={() =>
                            router.push(`/projects/${featuredProject.id}`)
                          }
                        >
                          View Project Details
                        </Button>
                      </div>
                      <div className="w-full md:w-64 aspect-video rounded-2xl bg-white/10 overflow-hidden relative group">
                        <img
                          src={
                            featuredProject.coverImage ||
                            `https://placehold.co/600x400/3b82f6/white?text=${featuredProject.title}`
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          {/* Sidebar: Heatmap, Achievements, Suggestions */}
          <div className="space-y-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Calendar size={14} /> Activity Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {last90Days.map((date, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${getActivityIntensity(
                        date
                      )}`}
                      title={`Activity on ${date}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-100 rounded-sm" />
                    <div className="w-2 h-2 bg-green-200 rounded-sm" />
                    <div className="w-2 h-2 bg-green-400 rounded-sm" />
                    <div className="w-2 h-2 bg-green-600 rounded-sm" />
                  </div>
                  <span>More</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Trophy size={14} /> Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.achievements?.length > 0 ? (
                  user.achievements.slice(0, 3).map((ua: any, i: number) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
                        🏆
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {ua.achievement?.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ua.achievement?.description}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">🔒</div>
                    <div className="text-sm font-bold text-gray-900">
                      No achievements yet
                    </div>
                    <div className="text-xs text-gray-500">
                      Complete projects to earn badges!
                    </div>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => router.push(`/profile/${user?.id}`)}
                >
                  View All Achievements
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-600 text-white border-none">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Zap size={18} /> Pro Tip
                </h3>
                <p className="text-sm text-blue-100 mb-4 leading-relaxed">
                  Consistency is key! Try to complete at least one milestone
                  every day to keep your streak alive and earn more XP.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => router.push("/projects")}
                >
                  Explore Projects
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
