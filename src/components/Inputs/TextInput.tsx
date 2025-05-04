import { useField } from "formik";
import React, { InputHTMLAttributes, FC } from "react";
import {
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface ITextInputProps
  extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  name: string;
  helperText?: string;
  rows?: number;
}

export const TextInput: FC<ITextInputProps> = ({
  label,
  className,
  helperText,
  type = "text",
  ...props
}) => {
  const [field, meta] = useField(props);

  const baseClasses = `
  w-full
  px-4
  rounded-md
  border
  bg-white
  dark:bg-dark-card
  transition-all
  duration-300
  ease-in-out
  focus:ring-2
  focus:ring-primary-500/20
  focus:border-primary-500
  dark:focus:ring-primary-400/20
  dark:focus:border-primary-400
  outline-none
  ${
    meta.error
      ? "border-red-500 dark:border-red-400"
      : "border-gray-300 dark:border-dark-border"
  }
  ${
    props.disabled
      ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
      : "hover:border-gray-400 dark:hover:border-gray-500"
  }
  ${className}
`;

  const inputClasses = `${baseClasses} py-2.5 pr-10`;
  const textareaClasses = `${baseClasses} py-2 min-h-[120px]`.replace(
    "pr-10",
    ""
  );
  return (
    <div className="space-y-2">
      <label
        className={`block text-sm font-medium mb-1 transition-colors
          ${
            meta.error
              ? "text-red-600 dark:text-red-400"
              : "text-gray-700 dark:text-gray-200"
          }
        `}
      >
        {label}
      </label>
      <div className="relative">
        {type !== "textarea" ? (
          <input
            {...field}
            {...props}
            type={type}
            className={`block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:focus:border-primary-400 dark:bg-gray-700 dark:text-gray-200${className}`}
            aria-describedby={helperText ? `${props.id}-helper` : undefined}
          />
        ) : (
          <textarea
            {...field}
            {...props}
            rows={props.rows || 4}
            className={`block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:focus:border-primary-400 dark:bg-gray-700 dark:text-gray-200 ${className} `}
            aria-describedby={helperText ? `${props.id}-helper` : undefined}
          />
        )}
        {meta.touched && meta.error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
          </div>
        )}
      </div>
      {meta.touched && meta.error ? (
        <div className="flex items-start gap-1.5 text-sm text-red-600 dark:text-red-400">
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{meta.error}</span>
        </div>
      ) : (
        helperText && (
          <div className="flex items-start gap-1.5 text-sm text-gray-500 dark:text-gray-300">
            <InformationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span id={`${props.id}-helper`}>{helperText}</span>
          </div>
        )
      )}
    </div>
  );
};
