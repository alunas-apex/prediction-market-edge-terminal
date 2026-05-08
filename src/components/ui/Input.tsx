"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-mono text-gray-400 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-terminal-bg border-terminal-border
            px-3 py-2 text-sm font-mono text-gray-200
            placeholder:text-gray-600
            focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-150
            ${icon ? "pl-10" : ""}
            ${error ? "border-accent-red/50 focus:border-accent-red/50 focus:ring-accent-red/20" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-accent-red">{error}</p>
      )}
    </div>
  );
}