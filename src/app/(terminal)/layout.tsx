"use client";

import { useState } from "react";
import { TerminalNav } from "@/components/layout/TerminalNav";
import { StatusBar } from "@/components/layout/StatusBar";
import { MOCK_ALERTS, DEFAULT_CONNECTION_STATUS } from "@/lib/constants";

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const unreadAlerts = MOCK_ALERTS.filter((a) => !a.read).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-terminal-bg">
      <TerminalNav
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed(!navCollapsed)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 overflow-auto p-4">{children}</main>
        <StatusBar
          connectionStatus={DEFAULT_CONNECTION_STATUS}
          alertsCount={MOCK_ALERTS.length}
          unreadAlerts={unreadAlerts}
        />
      </div>
    </div>
  );
}