"use client";
import React, { useEffect, useState } from "react";
import { 
  Button, 
  Card, 
  CardContent, 
  Badge, 
  AxiosClient,
  CardHeader,
  CardTitle
} from "@/components";
import { 
  Trophy, 
  Zap, 
  Flame, 
  Github, 
  Linkedin, 
  Globe, 
  Mail, 
  MapPin, 
  Calendar,
  ExternalLink,
  Code2,
  CheckCircle2,
  Award,
  History,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/context";

interface ProfileProps {
  username?: string;
}

export const ProfilePage = ({ username }: ProfileProps) => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"showcase" | "activity" | "achievements" | "skills">("showcase");

  const isOwnProfile = !username || (currentUser && (username === currentUser.id || username === currentUser.email));

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // If no username provided, fetch current user's full profile
        const endpoint = username ? `/users/profile/${username}` : `/users/me`;
        const res = await AxiosClient.get(endpoint);
        setProfile(res.data?.data);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  if (loading) return <div className="p-12 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-12 text-center">User not found</div>;

  const tabs = [
    { id: "showcase", label: "Showcase", icon: Code2 },
    { id: "activity", label: "Activity", icon: History },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "skills", label: "Skills", icon: Zap },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header */}
        <Card className="border-none shadow-sm mb-8 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
          <CardContent className="px-8 pb-8 -mt-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="flex flex-col md:flex-row items-end gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl border-4 border-white overflow-hidden bg-white shadow-lg">
                    <img 
                      src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}`} 
                      alt={profile.firstName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {profile.streak > 0 && (
                    <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-xl shadow-lg flex items-center gap-1 text-xs font-bold">
                      <Flame size={14} fill="currentColor" /> {profile.streak}
                    </div>
                  )}
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    {profile.firstName} {profile.lastName}
                    <Badge variant="secondary" className="text-xs">{profile.skillLevel}</Badge>
                  </h1>
                  <p className="text-gray-500 mt-1 max-w-lg">{profile.bio || "No bio yet."}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> Remote</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-3 ml-2">
                      {profile.githubId && <a href={`https://github.com/${profile.githubId}`} className="hover:text-gray-900 transition-colors"><Github size={18} /></a>}
                      <a href="#" className="hover:text-blue-600 transition-colors"><Linkedin size={18} /></a>
                      <a href="#" className="hover:text-blue-600 transition-colors"><Globe size={18} /></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mb-2">
                {isOwnProfile ? (
                  <Button variant="outline" className="gap-2">
                    <Edit2 size={16} /> Edit Profile
                  </Button>
                ) : (
                  <Button className="gap-2">
                    Follow User
                  </Button>
                )}
                <Button variant="transparent" className="p-2 border rounded-xl hover:bg-gray-100">
                  <ExternalLink size={20} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Stats Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-yellow-50 text-yellow-700">
                  <div className="flex items-center gap-2">
                    <Zap size={18} />
                    <span className="font-medium">Total XP</span>
                  </div>
                  <span className="font-bold">{profile.xp}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 text-blue-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    <span className="font-medium">Completed</span>
                  </div>
                  <span className="font-bold">{profile.projects?.filter((p: any) => p.status === "COMPLETED").length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50 text-purple-700">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} />
                    <span className="font-medium">Rank</span>
                  </div>
                  <span className="font-bold">Top 5%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <Mail size={16} /> {profile.email}
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === "showcase" && (
                  <motion.div
                    key="showcase"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {profile.projects?.filter((p: any) => p.status === "COMPLETED").map((up: any) => (
                      <Card key={up.id} className="group hover:border-blue-200 transition-all cursor-pointer overflow-hidden" onClick={() => router.push(`/projects/${up.projectId}`)}>
                        <div className="h-32 bg-gray-100 relative">
                          <img 
                            src={up.project?.thumbnailUrl || `https://placehold.co/600x400/3b82f6/white?text=${up.project?.title}`} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-500 text-white border-none">Completed</Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{up.project?.title}</h3>
                          <div className="flex gap-2 mt-2">
                            {up.project?.technologies?.slice(0, 3).map((tech: string) => (
                              <Badge key={tech} variant="outline" className="text-[10px] uppercase tracking-widest">{tech}</Badge>
                            ))}
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="text-xs text-gray-400">
                              Completed {new Date(up.completedAt).toLocaleDateString()}
                            </div>
                            <Button variant="transparent" size="sm" className="h-8 text-blue-600 font-bold p-0">
                              View Project <ExternalLink size={12} className="ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {profile.projects?.filter((p: any) => p.status === "COMPLETED").length === 0 && (
                      <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed rounded-3xl">
                        No completed projects showcased yet.
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "activity" && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4 items-start relative pb-8 last:pb-0">
                        <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200" />
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 z-10">
                          <CheckCircle2 size={16} />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="text-sm font-medium text-gray-900">
                            Completed milestone <span className="font-bold text-blue-600">"API Integration"</span> in E-commerce Store project.
                          </div>
                          <div className="text-xs text-gray-400 mt-1">2 days ago</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "achievements" && (
                  <motion.div
                    key="achievements"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                  >
                    {profile.achievements?.map((ua: any) => (
                      <div key={ua.id} className="flex flex-col items-center text-center group">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Award size={32} className="text-yellow-600" />
                        </div>
                        <div className="font-bold text-gray-900 text-sm">{ua.achievement?.title}</div>
                        <div className="text-[10px] text-gray-400 mt-1">{ua.achievement?.description}</div>
                      </div>
                    ))}
                    {(!profile.achievements || profile.achievements.length === 0) && (
                      [1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center text-center opacity-40">
                          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                            <Award size={32} className="text-gray-300" />
                          </div>
                          <div className="font-bold text-gray-400 text-sm">Locked</div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === "skills" && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Core Technologies</h4>
                      <div className="flex flex-wrap gap-3">
                        {["React", "Next.js", "TypeScript", "TailwindCSS", "Node.js", "Prisma", "PostgreSQL"].map((skill) => (
                          <div key={skill} className="px-4 py-2 bg-white border rounded-xl flex items-center gap-2 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="font-medium text-gray-700">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Skill Proficiency</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { name: "Frontend Development", value: 85 },
                          { name: "Backend Development", value: 70 },
                          { name: "UI/UX Design", value: 60 },
                          { name: "DevOps", value: 45 },
                        ].map((skill) => (
                          <div key={skill.name}>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                              <span className="text-sm font-bold text-blue-600">{skill.value}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.value}%` }}
                                className="h-full bg-blue-600 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
