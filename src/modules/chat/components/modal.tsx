import { TextInput, Button } from "@/components";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";
import { useChatState } from "../context";

export const ChatModal = ({ onClose }: { onClose: () => void }) => {
  const { loading, sendMessage, messages } = useChatState();
  const [newPrompt, setNewPrompt] = useState("");

  const latestChatId =
    messages.length > 0 ? messages[messages.length - 1].chatId : undefined;

  const handleSendMessage = async (question: string) => {
    if (!question.trim()) return toast.error("Enter a message to proceed");
    sendMessage(question, latestChatId);
    setNewPrompt("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-xl shadow-lg flex flex-col h-[90vh] relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            AI Guide
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((item) => (
            <div key={item._id} className="flex flex-col gap-2">
              {item.role === "assistant" ? (
                <div className="flex justify-end">
                  <div className="bg-blue-100 dark:bg-blue-800 text-gray-900 dark:text-white px-4 py-3 rounded-2xl max-w-[75%]">
                    {item.response}
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-2xl max-w-[75%]">
                    {item.response}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t px-6 py-4 dark:border-gray-700 flex items-center gap-3">
          <TextInput
            name="prompt"
            ignoreFormik
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(newPrompt)}
            placeholder="Ask your question..."
            className="flex-1 rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm"
          />
          <Button
            onClick={() => handleSendMessage(newPrompt)}
            disabled={loading}
            isLoading={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full"
          >
            <PaperAirplaneIcon className="w-5 h-5 rotate-90" />
          </Button>
        </div>
      </div>
    </div>
  );
};
