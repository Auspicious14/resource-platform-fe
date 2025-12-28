import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useSocial } from "./context";

interface Activity {
  id: string;
  completedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  project: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function ActivityFeed() {
  const { getActivityFeed, isLoading } = useSocial();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getActivityFeed().then(setActivities);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Activity Feed
      </h2>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No recent activity. Follow other learners to see their progress!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <Link href={`/profile/${activity.user.id}`}>
                  {activity.user.avatarUrl ? (
                    <img
                      src={activity.user.avatarUrl}
                      alt={activity.user.firstName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {activity.user.firstName[0]}
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 dark:text-white">
                    <Link
                      href={`/profile/${activity.user.id}`}
                      className="font-semibold hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {activity.user.firstName} {activity.user.lastName}
                    </Link>
                    {" completed "}
                    <Link
                      href={`/projects/${activity.project.slug}`}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {activity.project.title}
                    </Link>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(activity.completedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
