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
  BrainCircuit, 
  Code2, 
  Database, 
  Smartphone, 
  Globe, 
  Clock, 
  Target, 
  ChevronRight, 
  BookOpen,
  Zap,
  CheckCircle2,
  Lock,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const LearningPathsPage = () => {
  const router = useRouter();
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setPaths([
            {
              id: "path-1",
              title: "Frontend Specialist",
              description: "Master modern frontend development from HTML/CSS to advanced React and Next.js applications.",
              icon: Globe,
              color: "text-blue-600",
              bg: "bg-blue-50",
              projectsCount: 12,
              estimatedTime: "3 months",
              difficulty: "BEGINNER TO ADVANCED",
              progress: 65,
              status: "in_progress",
              skills: ["React", "Next.js", "TypeScript", "TailwindCSS"]
            },
            {
              id: "path-2",
              title: "Backend Architect",
              description: "Learn to build scalable APIs, manage databases, and handle complex business logic with Node.js.",
              icon: Database,
              color: "text-purple-600",
              bg: "bg-purple-50",
              projectsCount: 10,
              estimatedTime: "4 months",
              difficulty: "INTERMEDIATE",
              progress: 0,
              status: "not_started",
              skills: ["Node.js", "Express", "Prisma", "PostgreSQL", "Redis"]
            },
            {
              id: "path-3",
              title: "Mobile App Developer",
              description: "Build cross-platform mobile applications using React Native and Expo.",
              icon: Smartphone,
              color: "text-green-600",
              bg: "bg-green-50",
              projectsCount: 8,
              estimatedTime: "2.5 months",
              difficulty: "INTERMEDIATE",
              progress: 0,
              status: "not_started",
              skills: ["React Native", "Expo", "Firebase", "App Store Deployment"]
            },
            {
              id: "path-4",
              title: "Fullstack Engineer",
              description: "The complete package. Learn to build end-to-end applications from scratch.",
              icon: Zap,
              color: "text-yellow-600",
              bg: "bg-yellow-50",
              projectsCount: 20,
              estimatedTime: "6 months",
              difficulty: "ADVANCED",
              progress: 0,
              status: "locked",
              skills: ["Frontend", "Backend", "DevOps", "Architecture"]
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch paths", error);
        setLoading(false);
      }
    };

    fetchPaths();
  }, []);

  if (loading) return <div className="p-12 text-center">Loading learning paths...</div>;

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] p-12 mb-12 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 blur-[100px] rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 blur-[80px] rounded-full -ml-32 -mb-32" />
          
          <div className="relative z-10 max-w-2xl">
            <Badge className="bg-blue-500 text-white border-none mb-6">Learning Journeys</Badge>
            <h1 className="text-5xl font-bold mb-6 leading-tight">Master Your Craft with Structured Paths</h1>
            <p className="text-blue-100 text-xl mb-8 leading-relaxed">
              Don't just learn tools, build masterpieces. Our paths are carefully curated project sequences designed to take you from zero to industry-ready.
            </p>
            <div className="flex gap-4">
              <Button className="bg-white text-blue-900 hover:bg-blue-50 h-12 px-8 font-bold rounded-xl">
                Get Started
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8 font-bold rounded-xl">
                How it works
              </Button>
            </div>
          </div>
        </div>

        {/* Current Progress (if any) */}
        {paths.some(p => p.status === "in_progress") && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <TrendingUp className="text-blue-600" /> Continue Learning
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {paths.filter(p => p.status === "in_progress").map(p => (
                <Card key={p.id} className="border-none shadow-lg overflow-hidden bg-white group">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className={`w-full md:w-64 ${p.bg} flex items-center justify-center p-12`}>
                        <p.icon size={64} className={p.color} />
                      </div>
                      <div className="flex-1 p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Badge variant="secondary" className="mb-3 uppercase tracking-widest text-[10px]">{p.difficulty}</Badge>
                            <h3 className="text-2xl font-bold text-gray-900">{p.title}</h3>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">{p.progress}%</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Completed</div>
                          </div>
                        </div>
                        <p className="text-gray-500 mb-8 leading-relaxed max-w-2xl">{p.description}</p>
                        
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between text-sm font-bold mb-2">
                              <span className="text-gray-900">Current Milestone: Project 8/12</span>
                              <span className="text-blue-600">Next: Real-time Analytics Dashboard</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${p.progress}%` }}
                                className="h-full bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-6">
                              <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                <Clock size={16} /> {p.estimatedTime}
                              </span>
                              <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                <Target size={16} /> {p.projectsCount} Projects
                              </span>
                            </div>
                            <Button className="h-12 px-8 font-bold gap-2 shadow-lg shadow-blue-500/30">
                              Continue Path <ChevronRight size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Paths Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore Available Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paths.map((p) => (
              <Card key={p.id} className={`border-none shadow-sm hover:shadow-xl transition-all duration-300 group ${p.status === 'locked' ? 'opacity-75' : ''}`}>
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl ${p.bg} ${p.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <p.icon size={28} />
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                    {p.status === 'locked' && <Lock size={16} className="text-gray-400" />}
                  </div>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">{p.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {p.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-[10px] border-gray-100 text-gray-400 font-medium">{skill}</Badge>
                    ))}
                  </div>

                  <div className="pt-6 border-t flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-bold">
                      <span className="flex items-center gap-1"><Clock size={14} /> {p.estimatedTime}</span>
                      <span className="flex items-center gap-1"><BookOpen size={14} /> {p.projectsCount}</span>
                    </div>
                    {p.status === 'locked' ? (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Locked</span>
                    ) : (
                      <Button variant="transparent" className="text-blue-600 font-bold p-0 group-hover:gap-2 transition-all">
                        View Path <ChevronRight size={14} />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Custom Path CTA */}
        <Card className="mt-20 border-2 border-dashed border-gray-200 bg-gray-50/50">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <BrainCircuit className="text-blue-600" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need a Custom Learning Path?</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Our AI can build a personalized learning journey based on your current skills and career goals.
            </p>
            <Button className="h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-blue-500/20">
              Launch Path Builder
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Import needed for icons to work correctly in the code
import { TrendingUp as TrendingUpIcon } from "lucide-react";
