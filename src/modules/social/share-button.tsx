import { useState } from "react";
import { useSocial } from "./context";
import { ShareIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface ShareButtonProps {
  projectId: string;
  projectTitle: string;
}

export default function ShareButton({
  projectId,
  projectTitle,
}: ShareButtonProps) {
  const { shareProject } = useSocial();
  const [isOpen, setIsOpen] = useState(false);

  const platforms = [
    { name: "Twitter", icon: "𝕏", color: "bg-black hover:bg-gray-800" },
    { name: "LinkedIn", icon: "in", color: "bg-blue-700 hover:bg-blue-800" },
    { name: "Facebook", icon: "f", color: "bg-blue-600 hover:bg-blue-700" },
  ];

  const handleShare = async (platform: string) => {
    try {
      const { shareUrl, ogImageUrl } = await shareProject(
        projectId,
        platform.toLowerCase()
      );

      const text = `Check out my project: ${projectTitle}`;
      let url = "";

      switch (platform.toLowerCase()) {
        case "twitter":
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case "linkedin":
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`;
          break;
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`;
          break;
      }

      window.open(url, "_blank", "width=600,height=400");
      setIsOpen(false);
      toast.success("Shared successfully!");
    } catch (error) {
      console.error("Share failed", error);
    }
  };

  const copyLink = async () => {
    try {
      const { shareUrl } = await shareProject(projectId, "copy");
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
      >
        <ShareIcon className="h-5 w-5" />
        Share
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Share Project
            </h3>
            <div className="space-y-2">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleShare(platform.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-white rounded-lg transition-colors ${platform.color}`}
                >
                  <span className="font-bold text-lg">{platform.icon}</span>
                  <span>{platform.name}</span>
                </button>
              ))}
              <button
                onClick={copyLink}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
