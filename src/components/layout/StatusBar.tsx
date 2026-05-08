"use client";
import React from "react";
import { Wifi, WifiOff, Clock, Bell, AlertTriangle, CheckCircle } from "lucide-react";
import { ConnectionStatus } from "@/types/index";
import { Badge } from "@/components/ui";

interface StatusBarProps {
  connectionStatus?: ConnectionStatus;
  alertsCount?: number;
  unreadAlerts?: number;
}

export function StatusBar({
  connectionStatus = { status: "connected", latency: 42, lastSync: new Date().toISOString() },
  alertsCount = 3,
  unreadAlerts = 2,
}: StatusBarProps) {
  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case "connected":
        return <Wifi size={14} className="text-accent-green" />;
      case "connecting":
        return <Wifi size={14} className="text-accent-amber animate-pulse" />;
      case "disconnected":
        return <WifiOff size={14} className="text-accent-red" />;
    }
  };


  const getStatusText = () => {
    switch (connectionStatus.status) {
      case "connected":
        return `Connected ${connectionStatus.latency}ms`;
      case "connecting":
        return "Connecting...";
      case "disconnected":
        return "Disconnected";
    }
  };

  const getStatusVariant = () => {
    switch (connectionStatus.status) {
      case "connected":
        return "success";
      case "connecting":
        return "warning";
      case "disconnected":
        return "danger";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };


  return (
    <footer className="flex items-center justify-between px-4 py-2 bg-terminal-surface border-t border-terminal-border">
      {/* Left Section - Connection Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span
            className={`font-mono text-xs ${
              connectionStatus.status === "connected"
                ? "text-gray-400"
                : connectionStatus.status === "connecting"
                ? "text-accent-amber"
                : "text-accent-red"
            }`}
          >
            {getStatusText()}
          </span>
        </div>
        <div className="w-px h-4 bg-terminal-border" />
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={14} />
          <span className="font-mono text-xs">
            {formatTime(new Date(connectionStatus.lastSync))}
          </span>
        </div>
      </div>

      {/* Right Section - Alerts */}
      <div className="flex items-center gap-4">
        <button className="relative flex items-center gap-2 px-2 py-1 rounded hover:bg-terminal-hover transition-colors">
          <Bell size={14} className="text-gray-500" />
          <span className="font-mono text-xs text-gray-500">
            Alerts ({alertsCount})
          </span>
          {unreadAlerts > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-accent-red rounded-full">
              <span className="font-mono text-[10px] text-white">{unreadAlerts}</span>
            </span>
          )}
        </button>


        <div className="w-px h-4 bg-terminal-border" />


        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant()} pulse={connectionStatus.status === "connected"}>
            <CheckCircle size={10} />
            {connectionStatus.status === "connected" ? "LIVE" : connectionStatus.status.toUpperCase()}
          </Badge>
        </div>
      </div>
    </footer>
  );
}