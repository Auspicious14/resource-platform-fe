import { TextInput, Button } from "@/components";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useChatState } from "../context";
import { IChat } from "../model";
import { MessageBubble } from "./bubble";

export const ChatModal = ({
  onClose,
  isOpen,
  projectId,
}: {
  onClose: () => void;
  isOpen?: boolean;
  projectId?: string;
}) => {
  const {
    loading,
    responseLoading,
    sendMessage,
    messages,
    getMessages,
    response,
    setMessages,
    setResponse,
  } = useChatState();
  const [newPrompt, setNewPrompt] = useState("");
  const [userQuestion, setUserQuestion] = useState("");

  const latestChatId =
    messages.length > 0 ? messages[messages.length - 1].chatId : undefined;

  useEffect(() => {
    getMessages();
  }, []);

  const handleSendMessage = async (question: string) => {
    if (!question.trim()) return toast.error("Enter a message to proceed");
    setUserQuestion(question);
    setMessages(
      (prev) =>
        [
          ...prev,
          { role: "user", content: question, chatId: latestChatId },
        ] as IChat[]
    );
    setResponse("");
    setUserQuestion("");
    await sendMessage(question, latestChatId);
    setNewPrompt("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-xl shadow-lg flex flex-col h-[70vh] relative overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Career Chat
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Ask anything about career paths, learning, or project guidance!
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 h-full px-6 py-4 flex-1">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-5 w-1/2 flex justify-end bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((item) => (
              <MessageBubble
                key={item._id}
                role={item.role}
                content={item.content}
              />
            ))}

            {userQuestion && (
              <MessageBubble role="user" content={userQuestion} />
            )}

            {response && (
              <MessageBubble
                isStreaming={responseLoading}
                role="assistant"
                content={response}
              />
            )}
          </div>
        )}

        <div className="border-t px-6 py-4 dark:border-gray-700 flex items-center gap-3 w-full">
          <div className="w-[90%]">
            <TextInput
              name="prompt"
              ignoreFormik
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSendMessage(newPrompt)
              }
              placeholder="Ask your question..."
              className="flex-1 rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm w-full"
            />
          </div>
          <Button
            //   variant="transparent"
            onClick={() => handleSendMessage(newPrompt)}
            disabled={loading}
            isLoading={loading}
            className="!w-10 !h-10 !rounded-full flex flex-col justify-center text-center"
          >
            <PaperAirplaneIcon className="w-5 h-5 rotate-70" />
          </Button>
        </div>
      </div>
    </div>
  );
};
