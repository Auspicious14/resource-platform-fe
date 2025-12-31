"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { AxiosClient } from "@/components";

interface IDashboardState {
  stats: any;
  inProgressProjects: any[];
  activities: any[];
  featuredProject: any;
  isLoading: boolean;
  refreshDashboard: () => Promise<void>;
}

const DashboardContext = createContext<IDashboardState | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [stats, setStats] = useState<any>(null);
  const [inProgressProjects, setInProgressProjects] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [featuredProject, setFeaturedProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statsRes, progressRes, activitiesRes, featuredRes] =
        await Promise.all([
          AxiosClient.get("/analytics/user"),
          AxiosClient.get("/projects/progress"),
          AxiosClient.get("/social/activity-feed"),
          AxiosClient.get("/projects/featured"),
        ]);

      const dashboardData = statsRes.data?.data;
      if (dashboardData) {
        const completedProjects =
          dashboardData.projectCompletion?.find(
            (pc: any) => pc.status === "COMPLETED"
          )?._count || 0;

        setStats({
          ...dashboardData.stats,
          completedProjects,
        });
      }
      setInProgressProjects(progressRes.data?.data || []);
      setActivities(activitiesRes.data?.data || []);

      if (featuredRes.data?.data?.length > 0) {
        setFeaturedProject(featuredRes.data.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <DashboardContext.Provider
      value={{
        stats,
        inProgressProjects,
        activities,
        featuredProject,
        isLoading,
        refreshDashboard: fetchDashboardData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
