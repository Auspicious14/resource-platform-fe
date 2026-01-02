// features/projects/components/GitHubIntegration.tsx
import React, { useState, useEffect } from "react";
import {
  Github,
  ExternalLink,
  GitCommit,
  GitBranch,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/Buttons";
import { Badge } from "@/components/Badge";
import toast from "react-hot-toast";
import { AxiosClient } from "@/components";
import Link from "next/link";

interface GitHubIntegrationProps {
  projectId: string;
  initialRepoUrl?: string;
  onRepoLinked: (url: string) => void;
}

export const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({
  projectId,
  initialRepoUrl,
  onRepoLinked,
}) => {
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl || "");
  const [isLinking, setIsLinking] = useState(false);
  const [isLinked, setIsLinked] = useState(!!initialRepoUrl);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [commits, setCommits] = useState<any[]>([]);

  useEffect(() => {
    if (initialRepoUrl) {
      setRepoUrl(initialRepoUrl);
      setIsLinked(true);
    }
  }, [initialRepoUrl]);

  useEffect(() => {
    if (isLinked && projectId) {
      fetchCommits();
    }
  }, [isLinked, projectId]);

  const fetchCommits = async () => {
    try {
      const response = await AxiosClient.get(`/github/${projectId}/commits`);
      if (response.data.success) {
        setCommits(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch commits");
    }
  };

  const handleLinkRepo = async () => {
    if (!repoUrl.includes("github.com")) {
      return toast.error("Please enter a valid GitHub repository URL");
    }

    setIsLinking(true);
    try {
      const response = await AxiosClient.post("/github/link", {
        projectId,
        repoUrl,
      });

      if (response.data.success) {
        setIsLinked(true);
        onRepoLinked(repoUrl);
        toast.success("GitHub repository linked successfully!");
        await fetchCommits();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to link repository");
    } finally {
      setIsLinking(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCommits();
    setIsRefreshing(false);
    toast.success("Repository status updated");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="">
      {!isLinked ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl">
              <Github size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Connect GitHub
              </h3>
              <p className="text-sm text-gray-500 dark:text-white">
                Link your repository to track progress
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="https://github.com/username/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
            <Button
              onClick={handleLinkRepo}
              disabled={isLinking || !repoUrl}
              className="w-full h-12 bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold rounded-xl gap-2"
            >
              {isLinking ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Linking...
                </>
              ) : (
                <div className="flex gap-2 itemss-center">
                  <Github size={18} />
                  Link Repository
                </div>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-blue-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Github size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    Linked Repository
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white truncate text-sm">
                    {repoUrl.replace("https://github.com/", "")}
                  </h4>
                </div>
              </div>
              <Link
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
              >
                <ExternalLink size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3">
                <GitBranch size={16} className="text-gray-400" />
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  main
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl p-3 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-green-500" />
                <div className="text-xs font-bold text-gray-700 dark:text-white">
                  {commits.length} commits
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full h-10 gap-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-white"
            >
              <div className="flex gap-2 items-center">
                <RefreshCw
                  size={14}
                  className={isRefreshing ? "animate-spin" : ""}
                />
                Refresh Status
              </div>
            </Button>
          </div>

          {commits.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Recent Activity
                </h4>
                <Badge
                  variant="outline"
                  className="text-[10px] dark:text-white"
                >
                  {commits.length} Commits
                </Badge>
              </div>

              <div className="space-y-3">
                {commits.slice(0, 5).map((commit, i) => (
                  <div
                    key={commit.id}
                    className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800 last:before:hidden"
                  >
                    <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-2 border-blue-500 z-10" />
                    <Link
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gray-50 dark:bg-gray-800 rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {commit.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                          {formatDate(commit.date)}
                        </span>
                        <span className="text-[10px] text-gray-300 dark:text-gray-600">
                          •
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                          {commit.author}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
