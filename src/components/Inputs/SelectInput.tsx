import { ComponentProps } from "react";

type Option = {
  value: string;
  label: string;
};

type SelectInputProps = {
  label: string;
  options: Option[];
} & ComponentProps<"select">;

export const SelectInput = ({ label, options, ...props }: SelectInputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select
        {...props}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
