import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { ClipboardDocumentIcon as ClipboardSolid } from "@heroicons/react/24/solid";
import { useState } from "react";

export const MessageBubble = ({
  role,
  content,
  isStreaming,
}: {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return (
    <div>
      <div
        className={`flex w-full ${isUser ? " justify-end" : "justify-star"}`}
      >
        <div
          className={`  ${
            isUser
              ? " bg-blue-100 dark:bg-blue-800 text-gray-900 dark:text-white "
              : " bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
          } p-2 mb-1 rounded-md gap-4 max-w-[75%]`}
        >
          <div className="flex gap-2 items-center justify-end">
            {copied ? (
              <ClipboardSolid fontSize={12} />
            ) : (
              <ClipboardDocumentIcon
                fontSize={12}
                className="w-7 h-7 text-white"
                onClick={() => handleCopy(content)}
              />
            )}
            <p>{copied ? "Copied" : "Copy"}</p>
          </div>
        </div>
      </div>
      <div className={`flex  ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`px-4 py-3 rounded-2xl max-w-[75%] ${
            isUser
              ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              : "bg-blue-100 dark:bg-blue-800 text-gray-900 dark:text-white"
          }`}
        >
          {content}
          {isStreaming && (
            <span className="inline-block w-1 h-4 bg-gray-500 animate-blink ml-1 rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
};
