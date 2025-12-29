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
  TextInput,
  SelectInput,
} from "@/components";
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  MessageSquare,
  Code2,
  Github,
  ExternalLink,
  ChevronRight,
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export const CommunityGalleryPage = () => {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setSubmissions([
            {
              id: "sub-1",
              title: "Modern E-commerce Backend",
              project: "E-commerce API",
              user: { firstName: "Alex", lastName: "Chen", avatar: null },
              technologies: ["Node.js", "Express", "Prisma"],
              stars: 124,
              comments: 12,
              views: 1200,
              thumbnail:
                "https://placehold.co/600x400/3b82f6/white?text=E-commerce+API",
              createdAt: new Date().toISOString(),
            },
            {
              id: "sub-2",
              title: "Real-time Chat App with Socket.io",
              project: "Chat Platform",
              user: { firstName: "Sarah", lastName: "Smith", avatar: null },
              technologies: ["React", "Socket.io", "MongoDB"],
              stars: 89,
              comments: 8,
              views: 850,
              thumbnail:
                "https://placehold.co/600x400/8b5cf6/white?text=Chat+Platform",
              createdAt: new Date().toISOString(),
            },
            {
              id: "sub-3",
              title: "SaaS Dashboard Template",
              project: "Admin Dashboard",
              user: { firstName: "Jordan", lastName: "Lee", avatar: null },
              technologies: ["Next.js", "TailwindCSS", "Framer Motion"],
              stars: 256,
              comments: 24,
              views: 3200,
              thumbnail:
                "https://placehold.co/600x400/10b981/white?text=Admin+Dashboard",
              createdAt: new Date().toISOString(),
            },
            {
              id: "sub-4",
              title: "Crypto Tracker with React Query",
              project: "Crypto Dashboard",
              user: { firstName: "Maria", lastName: "Garcia", avatar: null },
              technologies: ["React", "React Query", "Chart.js"],
              stars: 67,
              comments: 5,
              views: 600,
              thumbnail:
                "https://placehold.co/600x400/f59e0b/white?text=Crypto+Dashboard",
              createdAt: new Date().toISOString(),
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading)
    return <div className="p-12 text-center">Loading gallery...</div>;

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Gallery
            </h1>
            <p className="text-gray-500 text-lg">
              Explore amazing projects built by the community. Get inspired,
              learn from others, and showcase your own work.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setView("grid")}
            >
              <LayoutGrid
                size={18}
                className={view === "grid" ? "text-blue-600" : ""}
              />
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setView("list")}
            >
              <List
                size={18}
                className={view === "list" ? "text-blue-600" : ""}
              />
            </Button>
            <Button className="gap-2">Submit Your Work</Button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-2 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by project, tech, or developer..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <SelectInput
            ignoreFormik
            name="technology"
            options={[
              { label: "All Technologies", value: "" },
              { label: "React", value: "react" },
              { label: "Node.js", value: "nodejs" },
              { label: "TypeScript", value: "typescript" },
            ]}
            placeholder="Technology"
            className="w-full"
          />
          <SelectInput
            ignoreFormik
            name="sort"
            options={[
              { label: "Most Recent", value: "recent" },
              { label: "Most Popular", value: "popular" },
              { label: "Most Viewed", value: "views" },
            ]}
            placeholder="Sort By"
            className="w-full"
          />
        </div>

        {/* Submissions Grid */}
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {submissions.map((sub) => (
                <Card
                  key={sub.id}
                  className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/submissions/${sub.id}`)}
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={sub.thumbnail}
                      alt={sub.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <Button
                        variant="transparent"
                        className="bg-white/20 backdrop-blur-md text-white border-white/40 hover:bg-white/30 w-full gap-2"
                      >
                        View Submission <ExternalLink size={16} />
                      </Button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 border-none flex items-center gap-1 font-bold">
                        <ThumbsUp
                          size={12}
                          className="text-blue-600"
                          fill="currentColor"
                        />{" "}
                        {sub.stars}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sub.user.firstName}`}
                          alt=""
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-500">
                        {sub.user.firstName} {sub.user.lastName}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {sub.title}
                    </h3>
                    <div className="flex gap-2 mb-6">
                      {sub.technologies.slice(0, 3).map((tech: string) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-[10px] uppercase tracking-widest bg-gray-100 text-gray-600 border-none"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t text-gray-400">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1 text-xs font-bold">
                          <Eye size={14} /> {sub.views}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold">
                          <MessageSquare size={14} /> {sub.comments}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {submissions.map((sub) => (
                <Card
                  key={sub.id}
                  className="group border-none shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push(`/submissions/${sub.id}`)}
                >
                  <CardContent className="p-4 flex items-center gap-6">
                    <div className="w-24 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img
                        src={sub.thumbnail}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {sub.title}
                          </h3>
                          <div className="text-xs text-gray-500 mt-1">
                            by {sub.user.firstName} {sub.user.lastName} •{" "}
                            {sub.project}
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-center">
                            <div className="text-sm font-bold text-gray-900">
                              {sub.stars}
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              Stars
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-gray-900">
                              {sub.comments}
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              Comments
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-gray-300 group-hover:text-blue-600 transition-colors"
                    />
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
