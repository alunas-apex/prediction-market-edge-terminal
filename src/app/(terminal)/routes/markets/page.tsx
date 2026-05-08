"use client";

import React, { useMemo } from "react";
import { Activity, TrendingUp, TrendingDown, BarChart3, DollarSign, Zap } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { MarketScanner } from "@/components/MarketScanner";
import { MOCK_MARKETS } from "@/lib/constants";

function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toString();
}

export default function MarketsPage() {
  const stats = useMemo(() => {
    const activeMarkets = MOCK_MARKETS.length;
    const totalVolume = MOCK_MARKETS.reduce((sum, m) => sum + m.volume, 0);
    const totalLiquidity = MOCK_MARKETS.reduce((sum, m) => sum + m.liquidity, 0);
    const avgChange = MOCK_MARKETS.reduce((sum, m) => sum + m.changePercent, 0) / MOCK_MARKETS.length;
    return { activeMarkets, totalVolume, totalLiquidity, avgChange };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-gray-200">MARKET SCANNER</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time prediction market scanner</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" pulse><Activity size={10} />LIVE</Badge>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-cyan/20 rounded border border-accent-cyan/30">
              <BarChart3 size={20} className="text-accent-cyan" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono">ACTIVE MARKETS</p>
              <p className="text-lg font-mono font-bold text-accent-cyan">{stats.activeMarkets}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-green/20 rounded border border-accent-green/30">
              <DollarSign size={20} className="text-accent-green" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono">TOTAL VOLUME</p>
              <p className="text-lg font-mono font-bold text-accent-green">${formatCompactNumber(stats.totalVolume)}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded border ${stats.avgChange >= 0 ? "bg-accent-green/20 border-accent-green/30" : "bg-accent-red/20 border-accent-red/30"}`}>
              {stats.avgChange >= 0 ? <TrendingUp size={20} className="text-accent-green" /> : <TrendingDown size={20} className="text-accent-red" />}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono">24H CHANGE</p>
              <p className={`text-lg font-mono font-bold ${stats.avgChange >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                {stats.avgChange >= 0 ? "+" : ""}{stats.avgChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-amber/20 rounded border border-accent-amber/30">
              <Zap size={20} className="text-accent-amber" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono">LIQUIDITY</p>
              <p className="text-lg font-mono font-bold text-accent-amber">${formatCompactNumber(stats.totalLiquidity)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-terminal-surface rounded-lg border border-terminal-border p-4">
        <MarketScanner />
      </div>
    </div>
  );
}