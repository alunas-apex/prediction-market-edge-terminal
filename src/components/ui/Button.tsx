"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantStyles = {
  default: "bg-terminal-surface border-terminal-border text-gray-200 hover:bg-terminal-hover",
  primary: "bg-accent-cyan/20 border-accent-cyan/50 text-accent-cyan hover:bg-accent-cyan/30",
  success: "bg-accent-green/20 border-accent-green/50 text-accent-green hover:bg-accent-green/30",
  warning: "bg-accent-amber/20 border-accent-amber/50 text-accent-amber hover:bg-accent-amber/30",
  danger: "bg-accent-red/20 border-accent-red/50 text-accent-red hover:bg-accent-red/30",
  ghost: "bg-transparent border-transparent text-gray-400 hover:text-gray-200 hover:bg-terminal-hover",
};

const sizeStyles = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

export function Button({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-mono text-xs font-medium
        border transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}