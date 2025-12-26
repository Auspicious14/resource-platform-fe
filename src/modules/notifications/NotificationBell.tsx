import React, { useState, useRef, useEffect } from "react";
import { Bell, MessageSquare, Trophy, Star, CheckCircle2, User, X } from "lucide-react";
import { useNotifications, INotification } from "./NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: INotification["type"]) => {
    switch (type) {
      case "COMMENT": return <MessageSquare size={16} className="text-blue-500" />;
      case "ACHIEVEMENT": return <Trophy size={16} className="text-amber-500" />;
      case "REVIEW": return <Star size={16} className="text-purple-500" />;
      case "MENTOR_MESSAGE": return <User size={16} className="text-emerald-500" />;
      case "PROJECT_COMPLETE": return <CheckCircle2 size={16} className="text-green-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/80 hover:text-white transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-blue-900">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${!n.isRead ? "bg-blue-50/30" : ""}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 p-2 rounded-xl shrink-0 ${
                          n.type === "COMMENT" ? "bg-blue-50" :
                          n.type === "ACHIEVEMENT" ? "bg-amber-50" :
                          n.type === "REVIEW" ? "bg-purple-50" :
                          n.type === "MENTOR_MESSAGE" ? "bg-emerald-50" : "bg-gray-50"
                        }`}>
                          {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className={`text-sm font-bold truncate ${!n.isRead ? "text-gray-900" : "text-gray-600"}`}>
                              {n.title}
                            </h4>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                          {n.link && (
                            <Link href={n.link} className="mt-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest inline-block hover:underline">
                              View Details
                            </Link>
                          )}
                        </div>
                        {!n.isRead && (
                          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                    <Bell size={24} />
                  </div>
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
              <Link href="/notifications" className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
                View all activity
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
