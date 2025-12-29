"use client";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { IProject } from "./model";
import { AxiosClient } from "@/components";
import { useRouter } from "next/navigation";

interface IProjectState {
  project: IProject | null;
  projects: IProject[];
  featuredProjects: IProject[];
  isLoading: boolean;
  error: string | null;
  createProject: (values: any) => Promise<any>;
  updateProject: (id: string, values: any) => Promise<any>;
  deleteProject: (id: string) => Promise<boolean>;
  startProject: (projectId: string, difficultyMode: string) => Promise<any>;
  completeMilestone: (
    projectId: string,
    milestoneId: string,
    difficultyMode: string
  ) => Promise<any>;
  getProjects: () => Promise<void>;
  getFeaturedProjects: () => Promise<void>;
  getOneProject: (id: string) => Promise<any>;
  requestAIHint: (
    projectId: string,
    milestoneNumber: number,
    difficultyMode: string
  ) => Promise<string>;
  setProjects: (projects: IProject[]) => void;
  setFeaturedProjects: (projects: IProject[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const ProjectContext = createContext<IProjectState | undefined>(undefined);

export const useProjectState = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectState must be used within a ProjectProvider");
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const ProjectConextProvider = ({ children }: IProps) => {
  const router = useRouter();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<IProject[]>([]);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (values: any) => {
    setIsLoading(true);
    try {
      let dataToSend = values;
      const hasFile = values.coverImage instanceof File;

      if (hasFile) {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (
            key === "milestones" ||
            key === "resourceLinks" ||
            key === "learningObjectives" ||
            key === "technologies" ||
            key === "categories" ||
            key === "difficultyModes"
          ) {
            formData.append(key, JSON.stringify(values[key]));
          } else {
            formData.append(key, values[key]);
          }
        });
        dataToSend = formData;
      }

      const response = await AxiosClient.post("/projects", dataToSend, {
        headers: hasFile ? { "Content-Type": "multipart/form-data" } : {},
      });
      const data = response.data?.data;
      if (data) {
        setProjects((prev) => [data, ...prev]);
        toast.success("Project created successfully");
        router.push("/projects");
        return data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Creation failed");
      toast.error(err.response?.data?.message || "Project creation failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (id: string, values: any) => {
    setIsLoading(true);
    try {
      let dataToSend = values;
      const hasFile = values.coverImage instanceof File;

      if (hasFile) {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (
            key === "milestones" ||
            key === "resourceLinks" ||
            key === "learningObjectives" ||
            key === "technologies" ||
            key === "categories" ||
            key === "difficultyModes"
          ) {
            formData.append(key, JSON.stringify(values[key]));
          } else {
            formData.append(key, values[key]);
          }
        });
        dataToSend = formData;
      }

      const response = await AxiosClient.put(`/projects/${id}`, dataToSend, {
        headers: hasFile ? { "Content-Type": "multipart/form-data" } : {},
      });
      const data = response.data?.data;
      if (data) {
        setProjects((prev) =>
          prev.map((project) => (project.id === id ? data : project))
        );
        toast.success("Project updated successfully");
        return data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed");
      toast.error(err.response?.data?.message || "Project update failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getFeaturedProjects = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosClient.get("/projects/featured");
      const data = response.data?.data;
      if (data) {
        setFeaturedProjects(data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Fetching failed");
      toast.error(err.response?.data?.message || "Project fetching failed");
    } finally {
      setIsLoading(false);
    }
  };
  const getProjects = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosClient.get("/projects");
      const data = response.data?.data;
      if (data) {
        setProjects(data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Fetching failed");
      toast.error(err.response?.data?.message || "Project fetching failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getOneProject = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await AxiosClient.get(`/projects/${id}`);
      const data = response.data?.data;
      if (data) {
        setProject(data);
        return data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Fetching failed");
      toast.error(err.response?.data?.message || "Project fetching failed");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await AxiosClient.delete(`/projects/${id}`);
      const message = response.data?.message;
      if (message) {
        setProjects((prev) => prev.filter((project) => project.id !== id));
        toast.success(message || "Project deleted successfully");
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || "Deletion failed");
      toast.error(err.response?.data?.message || "Project deletion failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const startProject = async (projectId: string, difficultyMode: string) => {
    setIsLoading(true);
    try {
      const response = await AxiosClient.post(`/projects/${projectId}/start`, {
        difficultyModeChosen: difficultyMode,
      });
      const data = response.data;
      if (data.success) {
        toast.success(`Started project in ${difficultyMode} mode!`);
        // Optionally refresh the current project if it's the one we just started
        if (project && project.id === projectId) {
          await getOneProject(projectId);
        }
        return data;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to start project");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const completeMilestone = async (
    projectId: string,
    milestoneId: string,
    difficultyMode: string
  ) => {
    // setIsLoading(true); // Maybe avoid full page loading state for milestone completion?
    try {
      const response = await AxiosClient.post(
        `/projects/${projectId}/milestones/${milestoneId}/complete`,
        { difficultyMode }
      );
      if (response.data?.success) {
        toast.success("Milestone completed!");
        if (project && project.id === projectId) {
          await getOneProject(projectId);
        }
        return response.data;
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to complete milestone"
      );
      throw err;
    } finally {
      // setIsLoading(false);
    }
  };

  const requestAIHint = async (
    projectId: string,
    milestoneNumber: number,
    difficultyMode: string
  ) => {
    try {
      const response = await AxiosClient.post("/ai/hint-request", {
        projectId,
        milestoneNumber,
        difficultyMode,
      });
      return response.data?.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch AI hint");
      throw err;
    }
  };
  return (
    <ProjectContext.Provider
      value={{
        isLoading,
        error,
        projects,
        featuredProjects,
        project,
        createProject,
        updateProject,
        getProjects,
        getOneProject,
        deleteProject,
        startProject,
        completeMilestone,
        requestAIHint,
        setProjects,
        setFeaturedProjects,
        getFeaturedProjects,
        setIsLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
