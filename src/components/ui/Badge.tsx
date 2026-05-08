"use client";

import React from "react";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

const variantStyles = {
  default: "bg-terminal-hover text-gray-300 border-terminal-border",
  success: "bg-accent-green/20 text-accent-green border-accent-green/50",
  warning: "bg-accent-amber/20 text-accent-amber border-accent-amber/50",
  danger: "bg-accent-red/20 text-accent-red border-accent-red/50",
  info: "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/50",
};

export function Badge({
  variant = "default",
  children,
  className = "",
  pulse = false,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2 py-0.5
        font-mono text-xs font-medium
        border rounded-full
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              variant === "success"
                ? "bg-accent-green"
                : variant === "warning"
                ? "bg-accent-amber"
                : variant === "danger"
                ? "bg-accent-red"
                : "bg-accent-cyan"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              variant === "success"
                ? "bg-accent-green"
                : variant === "warning"
                ? "bg-accent-amber"
                : variant === "danger"
                ? "bg-accent-red"
                : "bg-accent-cyan"
            }`}
          />
        </span>
      )}
      {children}
    </span>
  );
}