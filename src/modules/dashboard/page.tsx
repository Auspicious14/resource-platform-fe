"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Badge,
  AxiosClient,
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

export const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [inProgressProjects, setInProgressProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, progressRes] = await Promise.all([
          AxiosClient.get("/analytics/user"),
          AxiosClient.get("/projects/progress"),
        ]);
        setStats(statsRes.data?.data);
        setInProgressProjects(progressRes.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return <div className="p-12 text-center">Loading your progress...</div>;

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "Developer"}! 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            You've completed 4 projects this month. Keep up the great work!
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
                  Browse All <ChevronRight size={16} />
                </Button>
              </div>

              <div className="space-y-4">
                {inProgressProjects.length > 0 ? (
                  inProgressProjects.map((p) => (
                    <Card
                      key={p.id}
                      className="group hover:border-blue-200 transition-all cursor-pointer"
                      onClick={() => router.push(`/projects/${p.projectId}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-40 aspect-video rounded-xl bg-gray-100 overflow-hidden">
                            <img
                              src={
                                p.project?.coverImage ||
                                `https://placehold.co/600x400/3b82f6/white?text=${p.project?.title}`
                              }
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {p.project?.title}
                                </h3>
                                <div className="flex gap-2 mt-1">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] uppercase tracking-widest"
                                  >
                                    {p.difficultyModeChosen}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] uppercase tracking-widest"
                                  >
                                    {p.project?.difficultyLevel}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-blue-600">
                                  65%
                                </div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                  Progress
                                </div>
                              </div>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "65%" }}
                                className="bg-blue-600 h-full rounded-full"
                              />
                            </div>
                            <div className="flex justify-between mt-4">
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} /> Last active 2h ago
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target size={12} /> 4/6 Milestones
                                </span>
                              </div>
                              <Button size="sm" className="h-8">
                                Continue <ChevronRight size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
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

            {/* Learning Path Progress */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BrainCircuit className="text-purple-600" /> Learning Path
              </h2>
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <Badge className="bg-white/20 text-white border-none mb-4">
                        Frontend Specialist Path
                      </Badge>
                      <h3 className="text-2xl font-bold mb-2">
                        Modern React & Next.js
                      </h3>
                      <p className="text-purple-100 mb-6">
                        Master the art of building scalable web applications
                        with the latest tools.
                      </p>
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-3xl font-bold">12/20</div>
                          <div className="text-xs font-bold uppercase tracking-widest text-purple-200">
                            Projects Done
                          </div>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div>
                          <div className="text-3xl font-bold">4</div>
                          <div className="text-xs font-bold uppercase tracking-widest text-purple-200">
                            To Next Level
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="58"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-white/10"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="58"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={364}
                          strokeDashoffset={364 * (1 - 0.6)}
                          className="text-white"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">60%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
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
                  {[...Array(91)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${
                        i % 7 === 0
                          ? "bg-green-600"
                          : i % 11 === 0
                          ? "bg-green-400"
                          : i % 5 === 0
                          ? "bg-green-200"
                          : "bg-gray-100"
                      }`}
                      title={`Activity on day ${i}`}
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
                {[
                  {
                    title: "Bug Hunter",
                    desc: "Resolved 5 issues in peer review",
                    icon: "🐞",
                    bg: "bg-red-50",
                  },
                  {
                    title: "Streak Master",
                    desc: "7 days of consistent coding",
                    icon: "🔥",
                    bg: "bg-orange-50",
                  },
                  {
                    title: "Pathfinder",
                    desc: "Started first learning path",
                    icon: "🗺️",
                    bg: "bg-blue-50",
                  },
                ].map((ach, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${ach.bg} flex items-center justify-center text-xl`}
                    >
                      {ach.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {ach.title}
                      </div>
                      <div className="text-xs text-gray-500">{ach.desc}</div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All Achievements
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-600 text-white border-none">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <BrainCircuit size={18} /> AI Suggestion
                </h3>
                <p className="text-sm text-blue-100 mb-4 leading-relaxed">
                  Based on your interest in React, you might like the
                  "E-commerce Dashboard" project. It covers advanced state
                  management!
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Check it out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
