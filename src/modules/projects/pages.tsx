"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { projects } from "./data";
import { IProject } from "./model";
import { useProjectState } from "./context";

export const ProjectsPage = () => {
  const { getProjects, projects: fetchedProjects } = useProjectState();

  useEffect(() => {
    getProjects();
  }, []);
  const allProjects: IProject[] = [...fetchedProjects, ...projects];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">All Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProjects.map((project: IProject) => (
          <Link
            key={project._id}
            href={`/projects/${project._id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-blue-800">
                {project.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  project.difficulty === "beginner"
                    ? "bg-blue-100 text-blue-800"
                    : project.difficulty === "intermediate"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {project.difficulty}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
