"use client";
import React, { createContext, useContext, useState } from "react";
import { AxiosClient } from "@/components";
import toast from "react-hot-toast";

interface ISubmissionState {
  submission: any;
  loading: boolean;
  getSubmission: (id: string) => Promise<void>;
  postComment: (id: string, comment: string) => Promise<void>;
}

const SubmissionContext = createContext<ISubmissionState | undefined>(
  undefined
);

export const useSubmission = () => {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error("useSubmission must be used within a SubmissionProvider");
  }
  return context;
};

export const SubmissionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getSubmission = async (id: string) => {
    setLoading(true);
    try {
      const res = await AxiosClient.get(`/code-review/${id}`);
      const data = res.data?.data;
      if (data) {
        setSubmission(data);
      }
    } catch (error: any) {
      console.error("Failed to fetch submission", error);
      toast.error("Failed to fetch submission");
    } finally {
      setLoading(false);
    }
  };

  const postComment = async (id: string, comment: string) => {
    try {
      const res = await AxiosClient.post(
        `/community/submissions/${id}/comment`,
        { content: comment }
      );
      if (res.data?.success) {
        toast.success("Comment posted successfully");
        // Refresh the submission to show the new comment
        await getSubmission(id);
      }
    } catch (error: any) {
      console.error("Failed to post comment", error);
      toast.error(error.response?.data?.message || "Failed to post comment");
    }
  };

  return (
    <SubmissionContext.Provider
      value={{ submission, loading, getSubmission, postComment }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};
