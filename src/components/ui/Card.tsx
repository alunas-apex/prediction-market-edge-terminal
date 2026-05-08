"use client";

import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export function Card({
  title,
  subtitle,
  children,
  className = "",
  headerActions,
}: CardProps) {
  return (
    <div
      className={`
        bg-terminal-surface border-terminal-border
        rounded-lg overflow-hidden
        ${className}
      `}
    >
      {(title || headerActions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border">
          <div>
            {title && (
              <h3 className="font-mono text-sm font-semibold text-gray-200">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}