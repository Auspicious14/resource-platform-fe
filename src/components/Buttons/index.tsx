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
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-white hover:bg-secondary/90",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    transparent: "border-none text-primary hover:bg-primary/10",
    danger: "border-2 border-red-500 text-red-600 hover:bg-red-50",
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
