import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AxiosClient } from "../../components";
import { IChat } from "./model";
import { getCookie } from "@/helper";

interface IChatState {
  loading: boolean;
  responseLoading: boolean;
  response: string;
  messages: IChat[];
  setResponse: (responsne: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<IChat[]>>;
  getMessages: (projectId?: string) => Promise<void>;
  sendMessage: (message: string, projectId?: string) => Promise<any>;
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
  const [responseLoading, setResponseLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const getMessages = async (projectId?: string) => {
    setLoading(true);
    try {
      const res = await AxiosClient.get(`/ai/chat/history/${projectId}`);
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

  const sendMessage = async (message: string, projectId?: string) => {
    setResponseLoading(true);
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const token = getCookie("token") || localStorage.getItem("token");
    try {
      const res = await fetch(`${baseURL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, projectId }),
      });
      // console.log(res.data, "responseee");
      const decoder = new TextDecoder();
      const reader: any = res.body?.getReader();
      let done = false;
      let responseText = "";

      while (!done) {
        const { value, done: doneReading } = await reader?.read();
        done = doneReading;
        if (done) break;
        const chunkValue = decoder.decode(value, { stream: true });
        responseText += chunkValue;
        setResponse(responseText);
        console.log(responseText, "message");
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setResponseLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        loading,
        responseLoading,
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
