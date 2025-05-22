import Image from "next/image";
import { IProject } from "./model";
import toast from "react-hot-toast";
import { Button } from "@/components";

export const ProjectDetailPage = ({ project }: { project: IProject }) => {
  const lastUpdated = new Date(project?.updatedAt).toLocaleDateString("en-US");
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <nav className="mb-4 text-sm text-gray-500 flex items-center space-x-2">
        <a href="/" className="hover:underline">
          Home
        </a>
        <span>/</span>
        <a href="/projects" className="hover:underline">
          Projects
        </a>
        <span>/</span>
        <span className="text-blue-900 font-semibold">{project.title}</span>
      </nav>

      <div className="w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={project?.coverImage}
          alt="Project Cover"
          width={1200}
          height={800}
          quality={100}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              {project.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>
                By{" "}
                <span className="font-semibold text-blue-800">
                  {project?.author}
                </span>
              </span>
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg">
              {project.difficulty === "beginner" && "🟦"}
              {project.difficulty === "intermediate" && "🟪"}
              {project.difficulty === "advanced" && "🟧"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
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
        </div>

        <p className="text-gray-600 mb-8 text-lg animate-fade-in">
          {project.description}
        </p>

        {project.requirements && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Prerequisites
            </h2>
            <ul className="list-disc list-inside space-y-2">
              {project.requirements.map((req: string) => (
                <li key={req} className="text-gray-600 capitalize">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Recommended Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.resources.map((resource: any) => (
              <div
                key={resource.title}
                className="bg-blue-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-semibold hover:underline flex items-center gap-2"
                  >
                    {resource.type === "video" && (
                      <span role="img" aria-label="video">
                        🎬
                      </span>
                    )}
                    {resource.type === "course" && (
                      <span role="img" aria-label="course">
                        📚
                      </span>
                    )}
                    {resource.type === "article" && (
                      <span role="img" aria-label="article">
                        📝
                      </span>
                    )}
                    {resource.title}
                  </a>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                      resource.type === "video"
                        ? "bg-red-100 text-red-700"
                        : resource.type === "course"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {resource.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {resource.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          {/* <a
            href={project.repoUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow font-semibold transition-colors"
          >
            Start Project
          </a> */}
          <Button
            className="bg-gray-100 hover:bg-gray-200 text-blue-800 px-6 py-2 rounded shadow font-semibold transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Copied");
            }}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

// Optional: Add fade-in animation
// In your global CSS (e.g., styles/globals.css), add:
// .animate-fade-in { animation: fadeIn 0.7s ease; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
