import { notFound } from "next/navigation";
import { projects } from "@/modules/projects/data";

export default function ProjectPage({ params }: { params: any }) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) return notFound();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <a
          href="/projects"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Projects
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-900">{project.title}</h1>
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

        <p className="text-gray-600 mb-8 text-lg">{project.description}</p>

        {project.requirements && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Learning Objectives
            </h2>
            <ul className="list-disc list-inside space-y-2">
              {project.requirements.map((req) => (
                <li key={req} className="text-gray-600">
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
            {project.resources.map((resource) => (
              <a
                key={resource.title}
                href={resource.url}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800">
                    {resource.type}
                  </span>
                  <span className="text-blue-600 hover:underline">
                    {resource.title}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
