import { useState, useEffect } from "react";
import { useSocial } from "./context";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
}

export default function FollowButton({
  userId,
  initialFollowing = false,
}: FollowButtonProps) {
  const { followUser, unfollowUser } = useSocial();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await followUser(userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Follow action failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isFollowing
          ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isFollowing ? (
        <>
          <UserMinusIcon className="h-5 w-5" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlusIcon className="h-5 w-5" />
          Follow
        </>
      )}
    </button>
  );
}
