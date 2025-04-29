export interface IProject {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  requirements?: string[];
  resources: Array<{
    type: "video" | "article" | "course";
    url: string;
    title: string;
  }>;
}
