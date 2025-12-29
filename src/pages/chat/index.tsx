import { AxiosClient } from "@/components";
import { useChatState } from "@/modules/chat/context";
import { ChatPage } from "@/modules/chat/page";
import { requireAuth } from "@/utils/ssr-auth";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";

const Chat = ({ messages }: any) => {
  const { setMessages } = useChatState();

  useEffect(() => {
    if (messages) setMessages(messages);
  }, [messages]);

  return <ChatPage />;
};

export default Chat;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = requireAuth(context);
  if ("redirect" in auth) return auth;

  try {
    const response = await AxiosClient.get("/ai/chat", {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    const data = response.data?.data;
    return { props: { messages: data || null } };
  } catch (error) {
    return { props: { messages: null } };
  }
};
