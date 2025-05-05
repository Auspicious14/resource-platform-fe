export interface IProject {
  id: string;
  title: string;
  difficulty: string | "beginner" | "intermediate" | "advanced";
  description: string;
  requirements?: string[];
  resources: Array<{
    type: string | "video" | "article" | "course";
    url: string;
    title: string;
  }>;
}
