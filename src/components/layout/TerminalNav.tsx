"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Brain,
  Briefcase,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { Badge } from "@/components/ui";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  Brain: <Brain size={20} />,
  Briefcase: <Briefcase size={20} />,
  ArrowLeftRight: <ArrowLeftRight size={20} />,
};

interface TerminalNavProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function TerminalNav({ collapsed = false, onToggle }: TerminalNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`
        flex flex-col
        bg-terminal-surface border-r border-terminal-border
        transition-all duration-200 ease-in-out
        ${collapsed ? "w-16" : "w-56"}
      `}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-terminal-border">
        <div className="flex items-center justify-center w-8 h-8 bg-accent-cyan/20 rounded border border-accent-cyan/50">
          <Terminal size={16} className="text-accent-cyan" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold text-gray-200 tracking-tight">
              PREDICTION
            </span>
            <span className="font-mono text-xs text-accent-cyan tracking-widest">
              EDGE TERMINAL
            </span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md
                    font-mono text-sm
                    transition-all duration-150
                    ${
                      isActive
                        ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30"
                        : "text-gray-400 hover:text-gray-200 hover:bg-terminal-hover border border-transparent"
                    }
                  `}
                >
                  <span className={isActive ? "text-accent-cyan" : ""}>
                    {iconMap[item.icon]}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge variant="danger" className="px-1.5 py-0.5">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Collapse Toggle */}
      <div className="px-2 py-4 border-t border-terminal-border">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2
            text-gray-500 hover:text-gray-300 hover:bg-terminal-hover
            rounded-md transition-all duration-150"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span className="font-mono text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}