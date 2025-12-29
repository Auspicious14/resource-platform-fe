"use client";
import React, { useEffect, useState } from "react";
import { AxiosClient, Card, CardContent } from "@/components";
import { Users, Layout, FileCode, TrendingUp } from "lucide-react";

export const AdminAnalytics = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await AxiosClient.get("/analytics/admin");
        if (response.data?.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading stats...</div>;

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Projects",
      value: stats?.totalProjects || 0,
      icon: Layout,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Submissions",
      value: stats?.totalSubmissions || 0,
      icon: FileCode,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Active Challenges",
      value: stats?.activeChallenges || 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, i) => (
        <Card key={i} className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
