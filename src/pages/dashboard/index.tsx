import { DashboardPage } from "@/modules/dashboard/page";
import { requireAuth } from "@/utils/ssr-auth";
import { GetServerSideProps } from "next";
import axios from "axios";

export default function Dashboard({ data }: { data: any }) {
  return <DashboardPage data={data} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = requireAuth(context);
  if ("redirect" in auth) return auth;

  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const token = auth.token;

    const [statsRes, progressRes, activitiesRes, featuredRes] =
      await Promise.all([
        axios.get(`${baseURL}/analytics/user`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/projects/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/social/activity-feed`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/projects/featured`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

    const dashboardData = statsRes.data?.data;
    let stats = null;
    if (dashboardData) {
      const completedProjects =
        dashboardData.projectCompletion?.find(
          (pc: any) => pc.status === "COMPLETED"
        )?._count || 0;

      stats = {
        ...dashboardData.stats,
        completedProjects,
      };
    }

    return {
      props: {
        data: {
          stats,
          inProgressProjects: progressRes.data?.data || [],
          activities: activitiesRes.data?.data || [],
          featuredProject: featuredRes.data?.data?.[0] || null,
        },
      },
    };
  } catch (error) {
    console.error("Dashboard SSR Fetch Error:", error);
    return {
      props: {
        data: {
          stats: null,
          inProgressProjects: [],
          activities: [],
          featuredProject: null,
        },
      },
    };
  }
};
