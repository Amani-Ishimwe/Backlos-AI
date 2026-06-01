import React from "react";
import Spinner from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-semibold rounded-btn transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-border focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-brand-primary text-white hover:bg-[#5A51E6] active:bg-[#493FCF]",
    secondary: "bg-brand-light text-brand-primary hover:bg-[#E2E0FF] active:bg-[#D1CEFF]",
    outline: "border-1.5 border-brand-border bg-white text-brand-primary hover:bg-brand-light",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-300",
    ghost: "bg-transparent text-brand-muted hover:bg-brand-light hover:text-brand-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-medium",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="mr-2 border-current" />}
      {children}
    </button>
  );
};

export default Button;
