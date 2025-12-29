export interface IProject {
  id: string;
  title: string;
  description: string;
  difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
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
  hints: string[] | Record<string, string[]>;
  validationCriteria?: string;
}

export interface IUserProject {
  id: string;
  userId: string;
  projectId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  difficultyModeChosen: "GUIDED" | "STANDARD" | "HARDCORE";
  repoUrl?: string;
  startedAt: string;
  completedAt?: string;
}
