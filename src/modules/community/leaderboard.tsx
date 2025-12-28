"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Badge,
  CardHeader,
  CardTitle,
} from "@/components";
import {
  Trophy,
  Medal,
  TrendingUp,
  Zap,
  Flame,
  Target,
  User as UserIcon,
  Search,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { useCommunity } from "./context";

export const LeaderboardPage = () => {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "all-time">(
    "monthly"
  );
  const { leaderboardUsers, loading, getLeaderboard } = useCommunity();

  useEffect(() => {
    getLeaderboard(timeframe);
  }, [timeframe]);

  const topThree = leaderboardUsers.slice(0, 3);
  const others = leaderboardUsers.slice(3);

  if (loading)
    return <div className="p-12 text-center">Loading leaderboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 pt-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500" size={40} /> Community
            Leaderboard
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Celebrate the top contributors and developers in our community.
            Every project completed brings you closer to the top!
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-2xl shadow-sm border flex gap-1">
            {["weekly", "monthly", "all-time"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t as any)}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  timeframe === t
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end">
          {/* Rank 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-2 md:order-1"
          >
            <Card className="border-none shadow-lg text-center bg-white overflow-visible pt-12 relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <div className="w-20 h-20 rounded-3xl border-4 border-white overflow-hidden bg-gray-100 shadow-xl">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1]?.firstName}`}
                    alt=""
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center font-bold text-gray-700 text-sm">
                  2
                </div>
              </div>
              <CardContent>
                <h3 className="text-xl font-bold text-gray-900">
                  {topThree[1]?.firstName} {topThree[1]?.lastName}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 border-none"
                  >
                    Level {topThree[1]?.level}
                  </Badge>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-around">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {topThree[1]?.xp}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Total XP
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {topThree[1]?.projects}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Projects
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rank 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-1 md:order-2"
          >
            <Card className="border-none shadow-2xl text-center bg-gradient-to-b from-blue-600 to-indigo-700 text-white overflow-visible pt-16 relative scale-110">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 rounded-[2rem] border-4 border-white overflow-hidden bg-white shadow-2xl">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0]?.firstName}`}
                    alt=""
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-yellow-400 border-4 border-white flex items-center justify-center font-bold text-white shadow-lg animate-bounce">
                  <Trophy size={20} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 border-4 border-white flex items-center justify-center font-bold text-white shadow-lg">
                  1
                </div>
              </div>
              <CardContent>
                <h3 className="text-2xl font-bold">
                  {topThree[0]?.firstName} {topThree[0]?.lastName}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge className="bg-white/20 text-white border-none">
                    Level {topThree[0]?.level}
                  </Badge>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 flex justify-around">
                  <div>
                    <div className="text-2xl font-bold">{topThree[0]?.xp}</div>
                    <div className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">
                      Total XP
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {topThree[0]?.projects}
                    </div>
                    <div className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">
                      Projects
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rank 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-3"
          >
            <Card className="border-none shadow-lg text-center bg-white overflow-visible pt-12 relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <div className="w-20 h-20 rounded-3xl border-4 border-white overflow-hidden bg-gray-100 shadow-xl">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2]?.firstName}`}
                    alt=""
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center font-bold text-white text-sm">
                  3
                </div>
              </div>
              <CardContent>
                <h3 className="text-xl font-bold text-gray-900">
                  {topThree[2]?.firstName} {topThree[2]?.lastName}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-orange-50 text-orange-700 border-none"
                  >
                    Level {topThree[2]?.level}
                  </Badge>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-around">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {topThree[2]?.xp}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Total XP
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {topThree[2]?.projects}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Projects
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Full List */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b flex flex-row justify-between items-center">
            <CardTitle className="text-lg font-bold">Ranking Details</CardTitle>
            <div className="relative w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search developers..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Developer</th>
                    <th className="px-6 py-4">Level</th>
                    <th className="px-6 py-4 text-center">Projects</th>
                    <th className="px-6 py-4 text-center">Streak</th>
                    <th className="px-6 py-4 text-right">Total XP</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leaderboardUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/profile/${user.id}`)}
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {user.rank}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                              alt=""
                            />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-gray-400">
                              Software Developer
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className="text-xs border-blue-200 text-blue-600"
                        >
                          Level {user.level}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-700">
                        {user.projects}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-orange-500 font-bold">
                          <Flame size={14} fill="currentColor" /> {user.streak}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 font-bold text-gray-900">
                          <Zap
                            size={14}
                            className="text-yellow-500"
                            fill="currentColor"
                          />
                          {user.xp.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight
                          size={16}
                          className="text-gray-300 group-hover:text-blue-600 transition-colors"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
