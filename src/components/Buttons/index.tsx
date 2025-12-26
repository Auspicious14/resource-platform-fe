import { ButtonHTMLAttributes, FC } from "react";
import { clsx } from "clsx";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React from "react";

type TVariant = "primary" | "secondary" | "outline" | "danger" | "transparent";
type TSize = "sm" | "md" | "lg";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TVariant;
  size?: TSize;
  icon?: React.ElementType;
  isLoading?: boolean;
}

export const Button: FC<IButtonProps> = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  isLoading = false,
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20",
    transparent: "border-none text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20",
    danger: "border-2 border-red-500 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {isLoading ? (
        <ArrowPathIcon className="h-5 w-5 animate-spin" />
      ) : (
        Icon && <Icon className="h-5 w-5" />
      )}
      {children && (
        <span className={Icon || isLoading ? "ml-2" : ""}>{children}</span>
      )}
    </button>
  );
};
