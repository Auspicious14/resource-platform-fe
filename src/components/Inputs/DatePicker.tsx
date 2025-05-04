import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useField } from "formik";
import React from "react";

interface IDatePickerProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const DatePicker: React.FC<IDatePickerProps> = ({
  label,
  className,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {label}
        {props.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="date"
        className={`rounded-lg border ${
          meta.error
            ? "border-red-500 dark:border-red-400"
            : "border-gray-300 dark:border-dark-border"
        } focus:ring-2 focus:ring-primary-500/20 focus:border-transparent dark:bg-dark-card dark:text-gray-200 py-2.5 pr-10 ${className}`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error && (
        <div className="flex items-start gap-1.5 text-sm text-red-600 dark:text-red-400">
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{meta.error}</span>
        </div>
      )}
    </div>
  );
};
