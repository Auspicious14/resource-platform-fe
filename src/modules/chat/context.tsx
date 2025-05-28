import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AxiosClient } from "../../components";
import { IChat } from "./model";

interface IChatState {
  loading: boolean;
  messages: IChat[];
  setMessages: (category: IChat[]) => void;
  getMessages: (query?: any) => Promise<void>;
  sendMessage: (question: string, chatId?: string) => Promise<any>;
}

const ChatContext = React.createContext<IChatState | undefined>(undefined);

export const useChatState = () => {
  const context = React.useContext(ChatContext);
  if (context === undefined) {
    throw new Error("app dispatch must be used within app global provider");
  }

  return context;
};

interface IProps {
  children: React.ReactNode;
}
export const ChatContextProvider: React.FC<IProps> = ({ children }) => {
  const [messages, setMessages] = useState<IChat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getMessages = async (query?: any) => {
    setLoading(true);
    try {
      const res = await AxiosClient.get(`/chats`);
      const data = await res?.data?.data;
      if (data) {
        setMessages(data);
      }
      return data;
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (question: string, chatId?: string) => {
    try {
      const res = await AxiosClient.post(`/chat-with-ai`, { question, chatId });
      const data = res?.data?.data;
      if (data) {
        setMessages((prev) => [...prev, data]);
      }
      return data;
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        loading,
        messages,
        getMessages,
        setMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
