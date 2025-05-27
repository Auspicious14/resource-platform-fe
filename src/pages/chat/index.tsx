import { AxiosClient } from '@/components'
import { useChatState } from '@/modules/chat/context'
import { ChatPage } from '@/modules/chat/page'
import { GetServerSideProps } from 'next'
import React, { useEffect } from 'react'

const Chat = ({messages}: any) => {
    const {setMessages} = useChatState()
    
    useEffect(() => {
        if (messages) setMessages(messages)
    },[messages])

  return (
    <ChatPage />
  )
}

export default Chat

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const token = req.cookies?.token;
  
    if (!token) {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };
    }
  
    const response = await AxiosClient.get("/chats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data?.data;
    return { props: { messages: data || null } };
  };