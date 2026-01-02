export interface IProject {
  id: string;
  title: string;
  description: string;
  difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isFeatured: boolean;
  technologies: string[];
  categories: string[];
  estimatedTime?: string;
  learningObjectives: string[];
  resourceLinks: any[];
  starterRepoUrl?: string;
  difficultyModes: ("GUIDED" | "STANDARD" | "HARDCORE")[];
  submissionCount: number;
  completionRate: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  milestones: IProjectMilestone[];
  progressByMode?: Record<
    string,
    {
      status: string;
      completedMilestones: string[];
      userProjectId: string;
    }
  >;
  userProgress?: any;
  createdBy?: any;
  featured?: boolean;
  coverImage?: string | File;
}

export interface IProjectMilestone {
  id: string;
  projectId: string;
  milestoneNumber: number;
  title: string;
  description: string;
  hints: Record<"GUIDED" | "STANDARD" | "HARDCORE", string[]>;
  validationCriteria?: string;
}

export enum DifficultyMode {
  GUIDED = "GUIDED",
  STANDARD = "STANDARD",
  HARDCORE = "HARDCORE",
}

export enum Status {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}
export interface IUserProject {
  id: string;
  userId: string;
  projectId: string;
  status: Status;
  difficultyModeChosen: DifficultyMode;
  repoUrl?: string;
  startedAt: string;
  completedAt?: string;
}
