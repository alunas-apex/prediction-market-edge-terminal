"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  ArrowLeftRight,
  Briefcase,
  AlertTriangle,
  Activity,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";
import {
  MOCK_MARKETS,
  MOCK_ALERTS,
  MOCK_INSIGHTS,
  MOCK_ARBITRAGE,
} from "@/lib/constants";

function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(num);
}


function formatPercent(num: number): string {
  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-gray-200">
            DASHBOARD
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time prediction market overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" pulse>
            <Activity size={10} />
            LIVE
          </Badge>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-green/20 rounded border border-accent-green/30">
              <DollarSign size={20} className="text-accent-green" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono">PORTFOLIO VALUE</p>
              <p className="text-lg font-mono font-bold text-accent-green">
                $124,532.88
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-cyan/20 rounded border border-accent-cyan/30">
              <BarChart3 size={20} className="text-accent-cyan" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono">ACTIVE MARKETS</p>
              <p className="text-lg font-mono font-bold text-accent-cyan">
                {MOCK_MARKETS.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-amber/20 rounded border border-accent-amber/30">
              <ArrowLeftRight size={20} className="text-accent-amber" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono">ARB OPPORTUNITIES</p>
              <p className="text-lg font-mono font-bold text-accent-amber">
                {MOCK_ARBITRAGE.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-red/20 rounded border border-accent-red/30">
              <AlertTriangle size={20} className="text-accent-red" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono">UNREAD ALERTS</p>
              <p className="text-lg font-mono font-bold text-accent-red">
                {MOCK_ALERTS.filter((a) => !a.read).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Markets Table */}
        <div className="col-span-2">
          <Card
            title="MARKET DATA"
            subtitle="Live prediction market prices"
            headerActions={
              <Badge variant="success">
                <span className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                {MOCK_MARKETS.length} ACTIVE
              </Badge>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="text-left text-xs font-mono text-gray-500 pb-2">MARKET</th>
                    <th className="text-right text-xs font-mono text-gray-500 pb-2">PRICE</th>
                    <th className="text-right text-xs font-mono text-gray-500 pb-2">CHANGE</th>
                    <th className="text-right text-xs font-mono text-gray-500 pb-2">VOLUME</th>
                    <th className="text-right text-xs font-mono text-gray-500 pb-2">IMPLIED</th>
                    <th className="text-right text-xs font-mono text-gray-500 pb-2">UPDATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-terminal-border">
                  {MOCK_MARKETS.map((market) => (
                    <tr key={market.id} className="hover:bg-terminal-hover/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-gray-200">{market.symbol}</span>
                          <span className="text-xs text-gray-500 truncate max-w-[120px]">{market.name}</span>
                        </div>
                      </td>
                      <td className="text-right font-mono text-sm text-gray-200">
                        {market.price < 1 ? `${(market.price * 100).toFixed(0)}c` : formatNumber(market.price)}
                      </td>
                      <td className={`text-right font-mono text-sm ${market.change >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                        <div className="flex items-center justify-end gap-1">
                          {market.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {formatPercent(market.changePercent)}
                        </div>
                      </td>
                      <td className="text-right font-mono text-xs text-gray-400">{formatNumber(market.volume, 0)}</td>
                      <td className="text-right">
                        <Badge variant={market.impliedProbability >= 0.6 ? "success" : market.impliedProbability <= 0.4 ? "danger" : "warning"}>
                          {(market.impliedProbability * 100).toFixed(0)}%
                        </Badge>
                      </td>
                      <td className="text-right font-mono text-xs text-gray-500">{formatTime(market.lastUpdate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Alerts Panel */}
        <div className="col-span-1">
          <Card title="RECENT ALERTS" subtitle={`${MOCK_ALERTS.filter((a) => !a.read).length} unread`}>
            <div className="space-y-3">
              {MOCK_ALERTS.map((alert) => (
                <div key={alert.id} className={`p-3 rounded border ${alert.type === "success" ? "border-accent-green/30 bg-accent-green/5" : alert.type === "warning" ? "border-accent-amber/30 bg-accent-amber/5" : alert.type === "error" ? "border-accent-red/30 bg-accent-red/5" : "border-terminal-border bg-terminal-hover/30"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {alert.type === "success" && <Badge variant="success">{alert.type}</Badge>}
                      {alert.type === "warning" && <Badge variant="warning">{alert.type}</Badge>}
                      {alert.type === "info" && <Badge variant="info">{alert.type}</Badge>}
                    </div>
                    <span className="font-mono text-[10px] text-gray-500">{formatTime(alert.timestamp)}</span>
                  </div>
                  <p className="font-mono text-sm font-medium text-gray-200 mt-2">{alert.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* AI Insights */}
        <Card title="AI ANALYSIS" subtitle="Machine learning signals" headerActions={<Badge variant="info"><Brain size={10} />FRESH</Badge>}>
          <div className="space-y-3">
            {MOCK_INSIGHTS.map((insight) => (
              <div key={insight.id} className="flex items-center justify-between p-3 rounded border border-terminal-border hover:border-terminal-hover">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded ${insight.signal === "bullish" ? "bg-accent-green/20" : insight.signal === "bearish" ? "bg-accent-red/20" : "bg-terminal-hover"}`}>
                    <Brain size={16} className={insight.signal === "bullish" ? "text-accent-green" : insight.signal === "bearish" ? "text-accent-red" : "text-gray-400"} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-gray-200">{insight.market}</span>
                      <Badge variant={insight.signal === "bullish" ? "success" : insight.signal === "bearish" ? "danger" : "default"}>{insight.signal.toUpperCase()}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{insight.summary}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-gray-200">{(insight.confidence * 100).toFixed(0)}%</p>
                  <p className="text-[10px] text-gray-500">confidence</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Arbitrage Opportunities */}
        <Card title="ARBITRAGE OPPORTUNITIES" subtitle="Cross-exchange price differences" headerActions={<Badge variant="warning"><ArrowLeftRight size={10} />{MOCK_ARBITRAGE.length} FOUND</Badge>}>
          <div className="space-y-3">
            {MOCK_ARBITRAGE.map((arb) => (
              <div key={arb.id} className="flex items-center justify-between p-3 rounded border border-accent-amber/20 bg-accent-amber/5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-accent-amber/20 rounded">
                    <ArrowLeftRight size={16} className="text-accent-amber" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold text-gray-200">{arb.marketA} to {arb.marketB}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Expires: {new Date(arb.expiration).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-accent-green">+{arb.profitPercent.toFixed(1)}%</p>
                  <p className="text-[10px] text-gray-500">{(arb.confidence * 100).toFixed(0)}% confidence</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}