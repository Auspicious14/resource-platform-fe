"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IProject } from "./model";
import { useProjectState } from "./context";
import { useRouter } from "next/router";
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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Project Library
              </h1>
              <p className="text-gray-500 mt-2">
                Choose a project and start building your portfolio today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  <ListIcon size={20} />
                </button>
              </div>
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setIsFilterVisible(!isFilterVisible)}
              >
                <Filter size={20} />
              </Button>
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
                  label="Difficulty"
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleFilterChange as any}
                  options={difficultyOptions}
                />
                <SelectInput
                  label="Category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange as any}
                  options={categoryOptions}
                />
                <SelectInput
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
                      <Card
                        className="h-full flex flex-col group cursor-pointer"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        <div className="aspect-video relative overflow-hidden bg-gray-100 rounded-t-xl">
                          <img
                            src={
                              project.thumbnailUrl ||
                              `https://placehold.co/600x400/3b82f6/white?text=${project.title}`
                            }
                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            alt={project.title}
                          />
                          <div className="absolute top-3 left-3">
                            <Badge
                              variant={
                                project.difficultyLevel === "BEGINNER"
                                  ? "success"
                                  : project.difficultyLevel === "INTERMEDIATE"
                                  ? "default"
                                  : "destructive"
                              }
                              className="capitalize"
                            >
                              {project.difficultyLevel.toLowerCase()}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                            {project.description}
                          </p>
                          <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                              <span className="flex items-center gap-1.5">
                                <Code2 size={14} className="text-blue-500" />
                                {project.techStack?.[0] || "General"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Users size={14} className="text-purple-500" />
                                {project.submissionCount || 0}
                              </span>
                            </div>
                            <Button
                              variant="transparent"
                              size="sm"
                              className="p-0 text-blue-600 font-bold group-hover:translate-x-1 transition-transform"
                            >
                              Start Building <ChevronRight size={16} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card
                        className="group cursor-pointer hover:border-blue-200"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        <CardContent className="p-4 flex items-center gap-6">
                          <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            <img
                              src={
                                project.thumbnailUrl ||
                                `https://placehold.co/100x100/3b82f6/white?text=${project.title[0]}`
                              }
                              className="w-full h-full object-cover"
                              alt={project.title}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600">
                                {project.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase"
                              >
                                {project.difficultyLevel.toLowerCase()}
                              </Badge>
                            </div>
                            <p className="text-gray-500 text-sm truncate mb-2">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                              <span className="flex items-center gap-1">
                                <Code2 size={14} />{" "}
                                {project.techStack?.join(", ") || "No tags"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={14} />{" "}
                                {project.submissionCount || 0} solutions
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors" />
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
                    setFilters({ difficulty: "", title: "", sort: "newest", category: "" })
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
