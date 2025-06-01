import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AxiosClient } from "../../components";
import { IChat } from "./model";
import { getCookie } from "@/helper";

interface IChatState {
  loading: boolean;
  response: string;
  messages: IChat[];
  setResponse: (responsne: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<IChat[]>>;
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
  const [response, setResponse] = useState<string>("");

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
    setLoading(true);
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const token = getCookie("token") || localStorage.getItem("token");
    try {
      const res = await fetch(`${baseURL}/chat-with-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, chatId }),
      });
      // console.log(res.data, "responseee");
      const decoder = new TextDecoder();
      const reader: any = res.body?.getReader();
      let done = false;
      let message = "";

      while (!done) {
        const { value, done: doneReading } = await reader?.read();
        done = doneReading;
        if (done) break;
        const chunkValue = decoder.decode(value, { stream: true });
        message += chunkValue;
        setResponse(message);
        console.log(message, "message");
      }
      // console.log(message, "message");

      // const data = res?.data?.messages;
      // if (data) {
      //   setMessages((prev) => [...prev, ...data]);
      // }
      // return data;
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        loading,
        response,
        messages,
        getMessages,
        setMessages,
        setResponse,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
