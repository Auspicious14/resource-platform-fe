"use client";
import React, { createContext, useContext, useState } from "react";
import { AxiosClient } from "@/components";
import toast from "react-hot-toast";

interface ICommunityState {
  leaderboardUsers: any[];
  loading: boolean;
  getLeaderboard: (timeframe: string) => Promise<void>;
}

const CommunityContext = createContext<ICommunityState | undefined>(undefined);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
};

export const CommunityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [leaderboardUsers, setLeaderboardUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getLeaderboard = async (timeframe: string) => {
    setLoading(true);
    try {
      const response = await AxiosClient.get(
        `/gamification/leaderboard?timeframe=${timeframe}`
      );
      const data = response.data?.data;
      if (data) {
        setLeaderboardUsers(data);
      }
    } catch (error: any) {
      console.error("Failed to fetch leaderboard", error);
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommunityContext.Provider
      value={{ leaderboardUsers, loading, getLeaderboard }}
    >
      {children}
    </CommunityContext.Provider>
  );
};
