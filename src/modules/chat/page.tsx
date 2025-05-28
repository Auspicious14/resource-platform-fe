import React, { useEffect, useRef, useState } from "react";
import { useChatState } from "./context";
import { Button, TextInput } from "../../components";
import { PaperAirplaneIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { IChat } from "./model";

export const ChatPage: React.FC = () => {
  const { loading, sendMessage, messages } = useChatState();
  const [newPrompt, setNewPrompt] = useState<string>("");

  const latestChatId =
    messages.length > 0 ? messages[messages.length - 1].chatId : undefined;

  const handleSendMessage = async (question: string) => {
    if (question.trim() === "")
      return toast.error("Enter a message to proceed");
    sendMessage(question, latestChatId);
    setNewPrompt("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Career Chat
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Ask anything about career paths, learning, or project guidance!
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((item) => (
          <div
            key={item._id}
            className={`flex ${
              item.role === "user" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-md ${
                item.role === "user"
                  ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white"
                  : "bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white"
              }`}
            >
              {item.response}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <TextInput
            name="prompt"
            ignoreFormik
            type="text"
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            placeholder="Type your prompt..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(newPrompt)}
            className="flex-1 rounded-full px-4 py-3 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
          />
          <Button
            onClick={() => handleSendMessage(newPrompt)}
            disabled={loading}
            isLoading={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition"
          >
            <PaperAirplaneIcon className="w-5 h-5 rotate-90" />
          </Button>
        </div>
      </div>
    </div>
  );
};
