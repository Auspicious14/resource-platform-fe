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
    if (question === "") return toast.error("Enter a message to proceed");
    sendMessage(question, latestChatId);
  };

  return (
    <div className="flex flex-col h-svh bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          AI Guidance
        </h1>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {messages?.map((item) => (
            <div key={item._id} className="flex flex-col gap-2">
              {item?.role === "assistant" && (
                <div className="flex justify-end">
                  <div className="bg-blue-100 dark:bg-blue-900 text-gray-800 dark:text-gray-100 px-4 py-3 rounded-2xl max-w-[80%]">
                    {item.response}
                  </div>
                </div>
              )}

              {item?.role === "user" && (
                <div className="flex justify-start items-center gap-2">
                  <div className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-2xl max-w-[80%]">
                    {item.response}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 mt-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            <TextInput
              name="prompt"
              ignoreFormik
              type="text"
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Type your prompt..."
              onKeyDown={(e) =>
                e.key === "Enter" && handleSendMessage(newPrompt)
              }
              className="flex-1 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={() => handleSendMessage(newPrompt)}
              disabled={loading}
              isLoading={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-5 h-5 rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
