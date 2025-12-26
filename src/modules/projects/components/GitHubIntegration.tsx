import React, { useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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

  // Mock commit data
  const [commits] = useState([
    {
      id: "1",
      message: "Initial project setup and directory structure",
      date: "2 hours ago",
      author: "User",
    },
    {
      id: "2",
      message: "Implemented core components and routing",
      date: "5 hours ago",
      author: "User",
    },
    {
      id: "3",
      message: "Added authentication middleware and user service",
      date: "Yesterday",
      author: "User",
    },
  ]);

  const handleLinkRepo = async () => {
    if (!repoUrl.includes("github.com")) {
      return toast.error("Please enter a valid GitHub repository URL");
    }

    setIsLinking(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLinked(true);
      onRepoLinked(repoUrl);
      toast.success("GitHub repository linked successfully!");
    } catch (error) {
      toast.error("Failed to link repository");
    } finally {
      setIsLinking(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Repository status updated");
  };

  return (
    <div className="space-y-6">
      {!isLinked ? (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-900 text-white rounded-xl">
              <Github size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Connect GitHub</h3>
              <p className="text-sm text-gray-500">
                Link your repository to track progress and enable AI reviews.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>
            <Button
              onClick={handleLinkRepo}
              disabled={isLinking || !repoUrl}
              className="w-full h-12 bg-gray-900 hover:bg-black text-white font-bold rounded-xl gap-2"
            >
              {isLinking ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Linking...
                </>
              ) : (
                <>
                  <Github size={18} />
                  Link Repository
                </>
              )}
            </Button>
            <p className="text-[10px] text-center text-gray-400 font-medium uppercase tracking-widest">
              Make sure your repository is public or you've granted access
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Linked Repo Status */}
          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Github size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    Linked Repository
                  </div>
                  <h4 className="font-bold text-gray-900 truncate max-w-[180px]">
                    {repoUrl.replace("https://github.com/", "")}
                  </h4>
                </div>
              </div>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <GitBranch size={16} className="text-gray-400" />
                <div className="text-xs font-bold text-gray-700">main</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-green-500" />
                <div className="text-xs font-bold text-gray-700">
                  Up to date
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full h-10 gap-2 border-gray-100 hover:bg-gray-50 text-gray-600"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin" : ""}
              />
              Refresh Status
            </Button>
          </div>

          {/* Commit History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                Recent Activity
              </h4>
              <Badge variant="outline" className="text-[10px]">
                {commits.length} Commits
              </Badge>
            </div>

            <div className="space-y-3">
              {commits.map((commit, i) => (
                <div
                  key={commit.id}
                  className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100 last:before:hidden"
                >
                  <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-white border-2 border-blue-500 z-10" />
                  <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors cursor-pointer group">
                    <p className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {commit.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {commit.date}
                      </span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {commit.author}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3 border border-amber-100">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 leading-relaxed">
              AI analysis is enabled for this repository. New commits will be
              automatically reviewed for best practices.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
