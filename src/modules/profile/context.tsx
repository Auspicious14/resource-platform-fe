"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { AxiosClient } from "@/components";
import toast from "react-hot-toast";
import { useAuth } from "../auth/context";

interface IProfileState {
  profile: any;
  activities: any[];
  isLoading: boolean;
  getProfile: (username?: string) => Promise<void>;
  updateProfile: (data: any) => Promise<boolean>;
  getActivities: () => Promise<void>;
}

const ProfileContext = createContext<IProfileState | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, user: authUser } = useAuth();

  const getProfile = useCallback(async (username?: string) => {
    setIsLoading(true);
    try {
      const endpoint = username ? `/user/${username}` : `/auth/me`;
      const response = await AxiosClient.get(endpoint);
      if (response.data?.success) {
        setProfile(response.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch profile", error);
      toast.error(error.response?.data?.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: any) => {
      setIsLoading(true);
      try {
        // Assuming we have the current profile ID
        if (!profile?.id) throw new Error("User ID not found");
        const response = await AxiosClient.post(
          `/auth/update/${profile.id}`,
          data
        );
        if (response.data?.success) {
          const updatedData = response.data.data;
          setProfile(updatedData);
          if (authUser?.id === updatedData.id) {
            setUser(updatedData);
          }
          toast.success("Profile updated successfully");
          return true;
        }
        return false;
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to update profile"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [profile?.id]
  );

  const getActivities = useCallback(async () => {
    try {
      const response = await AxiosClient.get("/social/activity-feed");
      if (response.data?.success) {
        setActivities(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch activities", error);
    }
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        activities,
        isLoading,
        getProfile,
        updateProfile,
        getActivities,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
