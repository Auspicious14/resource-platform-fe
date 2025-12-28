"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  CalendarIcon,
  TrophyIcon,
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useEvents } from "@/modules/events/context";
import SEO from "@/components/seo";
import SkeletonCard from "@/components/skeleton-loader";

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { event, isLoading, fetchEvent, joinEvent, leaveEvent } = useEvents();
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent(id as string).then((data) => {
        if (data) {
          const userId = localStorage.getItem("userId");
          if (userId) {
            const participant = data.participants.find(
              (p: any) => p.userId === userId
            );
            setIsParticipant(!!participant);
          }
        }
      });
    }
  }, [id]);

  if (isLoading && !event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SkeletonCard />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Event not found
        </h1>
      </div>
    );
  }

  const handleJoin = async () => {
    await joinEvent(event.id);
    setIsParticipant(true);
  };

  const handleLeave = async () => {
    await leaveEvent(event.id);
    setIsParticipant(false);
  };

  return (
    <>
      <SEO
        title={event.title}
        description={event.description}
        image={event.bannerUrl}
        type="article"
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {event.bannerUrl && (
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm font-semibold rounded-full">
                {event.type}
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full">
                {event.status}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {event.title}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 whitespace-pre-wrap">
              {event.description}
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Leaderboard
              </h2>
              {event.leaderboard.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No participants yet
                </p>
              ) : (
                <div className="space-y-3">
                  {event.leaderboard
                    .slice(0, 10)
                    .map((entry: any, index: number) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-400">
                            #{index + 1}
                          </span>
                          {entry.user.avatarUrl ? (
                            <img
                              src={entry.user.avatarUrl}
                              alt={entry.user.firstName}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {entry.user.firstName[0]}
                            </div>
                          )}
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {entry.user.firstName} {entry.user.lastName}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {entry.score} pts
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Event Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Start Date
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {format(new Date(event.startDate), "PPP")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      End Date
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {format(new Date(event.endDate), "PPP")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UsersIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Participants
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {event.participants.length}
                      {event.maxParticipants && ` / ${event.maxParticipants}`}
                    </p>
                  </div>
                </div>
                {event.prizePool && (
                  <div className="flex items-start gap-3">
                    <TrophyIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Prize Pool
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {event.prizePool}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {isParticipant ? (
                  <button
                    onClick={handleLeave}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Leave Event
                  </button>
                ) : event.status === "UPCOMING" ? (
                  <button
                    onClick={handleJoin}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Join Event
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full px-4 py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                  >
                    Event {event.status.toLowerCase()}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
