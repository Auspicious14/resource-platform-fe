"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { AxiosClient } from "@/components";
import toast from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  prizePool?: string;
  maxParticipants?: number;
  bannerUrl?: string;
  participants: any[];
  leaderboard: any[];
  _count?: { participants: number };
}

interface EventContextType {
  events: Event[];
  event: Event | null;
  isLoading: boolean;
  fetchEvents: (status?: string) => Promise<void>;
  fetchEvent: (id: string) => Promise<Event | null>;
  joinEvent: (id: string) => Promise<void>;
  leaveEvent: (id: string) => Promise<void>;
  updateScore: (
    eventId: string,
    userId: string,
    score: number
  ) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async (status?: string) => {
    setIsLoading(true);
    try {
      const url = status ? `/events?status=${status}` : "/events";
      const response = await AxiosClient.get(url);
      setEvents(response.data?.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvent = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await AxiosClient.get(`/events/${id}`);
      const data = response.data?.data;
      setEvent(data);
      return data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch event");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const joinEvent = async (id: string) => {
    setIsLoading(true);
    try {
      await AxiosClient.post(`/events/${id}/join`);
      toast.success("Joined event successfully!");
      await fetchEvent(id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to join event");
    } finally {
      setIsLoading(false);
    }
  };

  const leaveEvent = async (id: string) => {
    setIsLoading(true);
    try {
      await AxiosClient.delete(`/events/${id}/leave`);
      toast.success("Left event successfully!");
      await fetchEvent(id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to leave event");
    } finally {
      setIsLoading(false);
    }
  };

  const updateScore = async (
    eventId: string,
    userId: string,
    score: number
  ) => {
    try {
      await AxiosClient.patch(`/events/${eventId}/score/${userId}`, { score });
      toast.success("Score updated!");
      await fetchEvent(eventId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update score");
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        event,
        isLoading,
        fetchEvents,
        fetchEvent,
        joinEvent,
        leaveEvent,
        updateScore,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within EventProvider");
  }
  return context;
};
