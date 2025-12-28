import { createContext, useContext, useState, ReactNode } from "react";
import { AxiosClient } from "@/components";
import toast from "react-hot-toast";

interface SocialContextType {
  isLoading: boolean;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  shareProject: (
    projectId: string,
    platform: string
  ) => Promise<{ shareUrl: string; ogImageUrl: string }>;
  isFollowing: (userId: string) => Promise<boolean>;
  getFollowers: (userId: string) => Promise<any[]>;
  getFollowing: (userId: string) => Promise<any[]>;
  getActivityFeed: () => Promise<any[]>;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const followUser = async (userId: string) => {
    setIsLoading(true);
    try {
      await AxiosClient.post("/social/follow", { followingId: userId });
      toast.success("Followed successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to follow user");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const unfollowUser = async (userId: string) => {
    setIsLoading(true);
    try {
      await AxiosClient.delete(`/social/unfollow/${userId}`);
      toast.success("Unfollowed successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to unfollow user");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const shareProject = async (projectId: string, platform: string) => {
    try {
      const response = await AxiosClient.post("/social/share", {
        projectId,
        platform,
      });
      return response.data?.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to share project");
      throw error;
    }
  };

  const isFollowing = async (userId: string) => {
    try {
      const response = await AxiosClient.get(`/social/following/${userId}`);
      const data = response.data?.data;
      return data?.some((f: any) => f.followingId === userId) || false;
    } catch (error) {
      return false;
    }
  };

  const getFollowers = async (userId: string) => {
    try {
      const response = await AxiosClient.get(`/social/followers/${userId}`);
      return response.data?.data || [];
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch followers");
      return [];
    }
  };

  const getFollowing = async (userId: string) => {
    try {
      const response = await AxiosClient.get(`/social/following/${userId}`);
      return response.data?.data || [];
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch following");
      return [];
    }
  };

  const getActivityFeed = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosClient.get("/social/activity-feed");
      return response.data?.data || [];
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch activity feed"
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SocialContext.Provider
      value={{
        isLoading,
        followUser,
        unfollowUser,
        shareProject,
        isFollowing,
        getFollowers,
        getFollowing,
        getActivityFeed,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error("useSocial must be used within SocialProvider");
  }
  return context;
};
