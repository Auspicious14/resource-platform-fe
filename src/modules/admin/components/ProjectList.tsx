"use client";
import React, { useEffect } from "react";
import { useProjectState } from "@/modules/projects/context";
import { Button, Card, CardContent, Badge } from "@/components";
import { Edit2, Trash2, Plus, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProjectEditModal } from "./ProjectEditModal";
import { IProject } from "@/modules/projects/model";
import { ProjectForm } from "@/modules/projects/components/ProjectForm";
import { Modal } from "@/components/Modal";

export const ProjectList = () => {
  const { projects, getProjects, deleteProject } = useProjectState();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<IProject | null>(
    null
  );

  useEffect(() => {
    getProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
        <Button
          onClick={() => router.push("/projects/create")}
          className="flex items-center gap-2"
        >
          <Plus size={18} /> Add New Project
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Title</th>
              <th className="px-6 py-4 font-bold">Difficulty</th>
              <th className="px-6 py-4 font-bold">Submissions</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">
                      {project.title}
                    </span>
                    <span className="text-xs text-gray-400 truncate max-w-xs">
                      {project.description}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="capitalize">
                    {project.difficultyLevel.toLowerCase()}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {project.submissionCount || 0}
                </td>
                <td className="px-6 py-4">
                  {project.featured ? (
                    <Badge className="bg-yellow-100 text-yellow-700 border-none">
                      Featured
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      Standard
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="transparent"
                      size="sm"
                      onClick={() => router.push(`/projects/${project.id}`)}
                      title="View"
                    >
                      <ExternalLink size={16} />
                    </Button>
                    <Button
                      variant="transparent"
                      size="sm"
                      className="text-blue-600"
                      onClick={() => {
                        setSelectedProject(project);
                        setIsEditModalOpen(true);
                      }}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="transparent"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(project.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="p-12 text-center text-gray-500 italic">
            No projects found.
          </div>
        )}
      </div>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
      >
        <ProjectForm
          initialData={selectedProject as IProject}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedProject(null);
          }}
        />
      </Modal>
    </div>
  );
};
