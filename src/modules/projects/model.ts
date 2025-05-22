export interface IProject {
  _id: string;
  title: string;
  difficulty: string | "beginner" | "intermediate" | "advanced";
  description: string;
  coverImage: string;
  author: string;
  requirements?: string[];
  resources: Array<{
    type: string | "video" | "article" | "course";
    url: string;
    title: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
