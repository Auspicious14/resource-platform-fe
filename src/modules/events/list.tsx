import { useState, useEffect } from "react";
import {
  CalendarIcon,
  TrophyIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { useEvents } from "./context";
import Link from "next/link";

export default function EventsList() {
  const { events, isLoading, fetchEvents, joinEvent } = useEvents();
  const [filter, setFilter] = useState<string>("UPCOMING");

  useEffect(() => {
    fetchEvents(filter);
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mb-8 text-blue-600 animate-bounce">
        <CalendarIcon className="h-12 w-12" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
        Events Coming Soon
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md text-center mb-10 font-medium">
        We're preparing exciting hackathons, workshops, and community
        challenges. Stay tuned for the launch!
      </p>
      <div className="flex gap-4">
        <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-500 dark:text-gray-400 font-bold text-sm">
          Hackathons
        </div>
        <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-500 dark:text-gray-400 font-bold text-sm">
          Workshops
        </div>
        <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-500 dark:text-gray-400 font-bold text-sm">
          Challenges
        </div>
      </div>

      {/* 
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Events & Challenges
          </h1>
          <div className="flex gap-2">
            {["UPCOMING", "ONGOING", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse"
              >
                <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4" />
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No {filter.toLowerCase()} events
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                {event.bannerUrl && (
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded">
                      {event.type}
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold rounded">
                      {event.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {formatDistanceToNow(new Date(event.startDate), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <UsersIcon className="h-4 w-4" />
                      <span>
                        {event._count?.participants} participants
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </span>
                    </div>
                    {event.prizePool && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <TrophyIcon className="h-4 w-4" />
                        <span>{event.prizePool}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/events/${event.id}`}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
                    >
                      View Details
                    </Link>
                    {event.status === "UPCOMING" && (
                      <button
                        onClick={() => joinEvent(event.id)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                      >
                        Join Event
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      */}
    </div>
  );
}
