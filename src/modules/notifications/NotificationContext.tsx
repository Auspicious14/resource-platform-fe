import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface INotification {
  id: string;
  type: "COMMENT" | "REVIEW" | "ACHIEVEMENT" | "MENTOR_MESSAGE" | "PROJECT_COMPLETE";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<INotification, "id" | "isRead" | "createdAt">) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  // Mock initial notifications
  useEffect(() => {
    const mockNotifications: INotification[] = [
      {
        id: "1",
        type: "ACHIEVEMENT",
        title: "New Badge Unlocked!",
        message: "You've earned the 'Fast Learner' badge for completing 3 projects in a week.",
        isRead: false,
        createdAt: new Date().toISOString(),
        link: "/profile",
      },
      {
        id: "2",
        type: "COMMENT",
        title: "New Comment",
        message: "Alex commented on your solution for 'E-commerce API'.",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        link: "/submissions/review",
      },
      {
        id: "3",
        type: "MENTOR_MESSAGE",
        title: "Message from Mentor",
        message: "Great job on the latest milestone! Here's some feedback.",
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        link: "/chat",
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotification = (notif: Omit<INotification, "id" | "isRead" | "createdAt">) => {
    const newNotification: INotification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
