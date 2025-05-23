"use client";
import React from "react";
import { Button } from "@/components";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProjectState } from "../projects/context";

export const HomePage = () => {
  const { featuredProjects } = useProjectState();
  const router = useRouter();

  return (
    <>
      <div>
        <div className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
              Master Software Development Through Projects
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Learn by building real-world projects with guided resources,
              curated learning paths, and community support.
            </p>
            <Button onClick={() => router.push("/projects")}>
              Get Started
            </Button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto py-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div
                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center
              justify-center mb-4 text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Project-Based Learning
              </h3>
              <p className="text-gray-600">
                Build portfolio-worthy projects with step-by-step guidance and
                real-world applications.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div
                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center
              justify-center mb-4 text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learning Roadmaps</h3>
              <p className="text-gray-600">
                Follow structured paths from beginner to advanced levels with
                milestone tracking.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div
                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center
              justify-center mb-4 text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-600">
                Get help from our active community and expert mentors when
                stuck.
              </p>
            </div>
          </div>

          <div className="py-8" id="projects">
            <h2 className="text-3xl font-bold text-blue-900 mb-8">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects?.map((project) => (
                <Link
                  href={`/projects/${project._id}`}
                  key={project._id}
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
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Learning Resources:
                    </h4>
                    <ul className="space-y-2">
                      {project.resources.map((resource, index) => (
                        <li key={index}>
                          <a
                            href={resource.url}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <span className="mr-2">🔗</span>
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-900 mb-4">
              Want to contribute to the platform?
            </h2>
            <p className="text-lg text-yellow-800 mb-6">
              Add your own project ideas and help others learn by building!
            </p>
            <Button
              onClick={() => router.push("/projects/create")}
              // className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md"
            >
              Add a Project
            </Button>
          </div>
        </div>
        <div className="bg-blue-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">
              What Our Learners Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-600 mb-4">
                  "The project-based approach helped me land my first frontend
                  role!"
                </p>
                <div className="flex items-center">
                  <img
                    src="/avatar1.png"
                    className="w-12 h-12 rounded-full mr-4"
                    alt="Sarah Johnson"
                  />
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Frontend Developer</p>
                  </div>
                </div>
              </div>
              {/* Add more testimonials */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
