import { createContext, useContext, useState } from "react";
import { IProject } from "./model";

interface IProjectState {}

const ProjectContext = createContext<IProjectState | undefined>(undefined);

export const useProjectState = () => {
  const context = useContext(ProjectContext);
  if (context === "undefined") {
    throw new Error("useProjectState must be used within a ProjectProvider");
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const ProjectConextProvider = ({ children }: IProps) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <ProjectContext.Provider value={{ projects }}>
      {children}
    </ProjectContext.Provider>
  );
};
