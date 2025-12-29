"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/context";
import Link from "next/link";
import { IProject } from "./model";
import { useProjectState } from "./context";
import { useRouter } from "next/router";
import { ProjectCard } from "@/components/Display/ProjectCard";
import {
  Button,
  Card,
  CardContent,
  Badge,
  TextInput,
  SelectInput,
} from "@/components";
import {
  Search,
  Filter,
  Clock,
  Layers,
  Code2,
  Users,
  LayoutGrid,
  List as ListIcon,
  ArrowUpDown,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DifficultyBadge } from "@/components/Display/DifficultyBadge";
import { Plus } from "lucide-react";

const difficultyOptions = [
  { label: "All Difficulties", value: "" },
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Most Popular", value: "popular" },
  { label: "Completion Rate", value: "completion" },
];

const categoryOptions = [
  { label: "All Categories", value: "" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Fullstack", value: "fullstack" },
  { label: "Mobile", value: "mobile" },
];

export const ProjectsPage = () => {
  const { user } = useAuth();
  const { projects } = useProjectState();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [filters, setFilters] = useState({
    difficulty: (router.query.difficulty as string) || "",
    category: (router.query.category as string) || "",
    title: (router.query.title as string) || "",
    sort: (router.query.sort as string) || "newest",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const query: any = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query[key] = value;
      });
      router.push({ pathname: "/projects", query }, undefined, {
        shallow: true,
      });
    }
  }, [filters, router.isReady]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-16 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <Layers size={12} />
                Explore Projects
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                Project Library
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 mt-4 max-w-2xl leading-relaxed">
                Master modern technologies by building real-world projects. From
                beginners to advanced developers, we have something for
                everyone.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex border border-gray-200 dark:border-gray-800 rounded-2xl p-1.5 bg-gray-50 dark:bg-gray-800 shadow-inner">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                  aria-label="List view"
                >
                  <ListIcon size={20} />
                </button>
              </div>
              <Button
                variant={isFilterVisible ? "secondary" : "outline"}
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="h-12 px-6 rounded-2xl border-2 font-bold dark:border-gray-800"
              >
                <Filter size={18} className="mr-2" />
                Filters
                {Object.values(filters).filter(Boolean).length > 1 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                    {Object.values(filters).filter(Boolean).length - 1}
                  </span>
                )}
              </Button>
              {["ADMIN", "CONTRIBUTOR"].includes(user?.role) && (
                <Link href="/projects/create">
                  <Button className="h-12 px-6 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all duration-300">
                    <Plus size={18} className="mr-2" />
                    Create Project
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Search size={16} /> Search
              </h3>
              <TextInput
                ignoreFormik
                name="title"
                value={filters.title}
                onChange={handleFilterChange as any}
                placeholder="Search projects..."
                className="w-full bg-white"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers size={16} /> Difficulty
              </h3>
              <div className="space-y-2">
                {difficultyOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={opt.value}
                      checked={filters.difficulty === opt.value}
                      onChange={handleFilterChange as any}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span
                      className={`text-sm ${
                        filters.difficulty === opt.value
                          ? "text-blue-600 font-medium"
                          : "text-gray-600 group-hover:text-gray-900"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers size={16} /> Category
              </h3>
              <SelectInput
                ignoreFormik
                label=""
                name="category"
                value={filters.category}
                onChange={handleFilterChange as any}
                options={categoryOptions}
                className="w-full bg-white"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ArrowUpDown size={16} /> Sort By
              </h3>
              <SelectInput
                ignoreFormik
                label=""
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange as any}
                options={sortOptions}
                className="w-full bg-white"
              />
            </div>
          </aside>

          {/* Mobile Filters Modal/Dropdown */}
          <AnimatePresence>
            {isFilterVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden w-full bg-white p-6 rounded-xl border border-gray-200 mb-6 space-y-6 overflow-hidden"
              >
                <TextInput
                  ignoreFormik
                  name="title"
                  value={filters.title}
                  onChange={handleFilterChange as any}
                  placeholder="Search projects..."
                />
                <SelectInput
                  ignoreFormik
                  label="Difficulty"
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleFilterChange as any}
                  options={difficultyOptions}
                />
                <SelectInput
                  ignoreFormik
                  label="Category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange as any}
                  options={categoryOptions}
                />
                <SelectInput
                  ignoreFormik
                  label="Sort By"
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange as any}
                  options={sortOptions}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content - Project Grid */}
          <div className="flex-1">
            {projects && projects.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-4"
                }
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {viewMode === "grid" ? (
                      <ProjectCard project={project} />
                    ) : (
                      <Card
                        className="group cursor-pointer border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 shadow-sm"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        <CardContent className="p-4 flex items-center gap-6">
                          <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                            <img
                              src={project.coverImage || `https://placehold.co/100x100/3b82f6/white?text=${project.title[0]}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                              alt={project.title}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {project.title}
                              </h3>
                              <DifficultyBadge
                                level={project.difficultyLevel}
                              />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1 mb-3">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              <span className="flex items-center gap-1.5">
                                <Clock size={12} className="text-blue-500" />
                                {project.estimatedTime || "2-4h"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Users size={12} className="text-purple-500" />
                                {project.submissionCount || 0} builders
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex font-bold dark:border-gray-700 dark:text-gray-300"
                          >
                            View Project
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  No projects found
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-1">
                  Try adjusting your search filters to find what you're looking
                  for.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() =>
                    setFilters({
                      difficulty: "",
                      title: "",
                      sort: "newest",
                      category: "",
                    })
                  }
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
