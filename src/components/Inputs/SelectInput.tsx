import { useField } from "formik";
import React, { ComponentProps } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

type Option = {
  value: string;
  label: string;
};

type SelectInputProps = {
  label?: string;
  name: string;
  options: Option[];
  placeholder?: string;
  ignoreFormik?: boolean;
} & ComponentProps<"select">;

export const SelectInput = ({
  label,
  options,
  placeholder,
  ignoreFormik,
  className,
  ...props
}: SelectInputProps) => {
  if (ignoreFormik) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <select
          {...props}
          className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const [field, meta] = useField(props as any);

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label
          className={`block text-sm font-medium mb-1 transition-colors
          ${
            meta.touched && meta.error
              ? "text-red-600 dark:text-red-400"
              : "text-gray-700 dark:text-gray-200"
          }
        `}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          {...field}
          {...props}
          className={`w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 transition-colors
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              meta.touched && meta.error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            }
            ${className}`}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {meta.touched && meta.error && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
          </div>
        )}
      </div>
      {meta.touched && meta.error && (
        <div className="flex items-start gap-1.5 text-sm text-red-600 dark:text-red-400">
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{meta.error}</span>
        </div>
      )}
    </div>
  );
};
