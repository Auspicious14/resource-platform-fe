import { IProject } from "./model";
import Link from "next/link";
import { projects } from "./data";

export const ProjectsPage = () => {
  const projects: IProject[] = [
    {
      id: "1",
      title: "Landing Page Template",
      difficulty: "beginner",
      description:
        "Build a responsive landing page with modern design principles",
      resources: [
        { type: "video", url: "#", title: "HTML & CSS Crash Course" },
      ],
    },
    {
      id: "2",
      title: "E-Commerce Dashboard",
      difficulty: "intermediate",
      description: "Create dynamic admin dashboard with React and Chart.js",
      resources: [
        { type: "article", url: "#", title: "React State Management Guide" },
      ],
    },
    {
      id: "3",
      title: "E-Commerce REST API",
      difficulty: "intermediate",
      description:
        "Develop a Node.js API with Express and MongoDB for product management",
      requirements: [
        "User authentication",
        "CRUD operations",
        "Error handling",
      ],
      resources: [{ type: "course", url: "#", title: "Node.js Fundamentals" }],
    },
    {
      id: "4",
      title: "Social Media Dashboard",
      difficulty: "advanced",
      description:
        "Build real-time dashboard with React, GraphQL and WebSockets",
      resources: [{ type: "video", url: "#", title: "GraphQL Subscriptions" }],
    },
    {
      id: "5",
      title: "Portfolio Website",
      difficulty: "beginner",
      description: "Create a personal portfolio with Next.js and Tailwind CSS",
      resources: [
        { type: "article", url: "#", title: "Next.js Deployment Guide" },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">All Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
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
