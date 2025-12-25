export interface IProject {
  id: string;
  title: string;
  description: string;
  content: string;
  difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  techStack: string[];
  thumbnailUrl?: string;
  authorId: string;
  author?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  milestones: IProjectMilestone[];
  resources: IProjectResource[];
  submissionCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  orderIndex: number;
  hints: string[];
  validationCriteria?: string;
}

export interface IProjectResource {
  id: string;
  projectId: string;
  title: string;
  url: string;
  type: "VIDEO" | "ARTICLE" | "COURSE" | "DOCUMENTATION";
}

export interface IUserProject {
  id: string;
  userId: string;
  projectId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "BOOKMARKED";
  currentMilestoneIndex: number;
  difficultyMode: "GUIDED" | "STANDARD" | "HARDCORE";
  repoUrl?: string;
  startedAt: string;
  completedAt?: string;
}
