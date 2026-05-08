"use client";
import React from "react";
import { Wallet, DollarSign, TrendingUp, TrendingDown, Briefcase, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import type { Position } from "@/types/index";

const MOCK_HOLDINGS: (Position & { symbol: string })[] = [
  { id: "1", symbol: "BTC", marketId: "btc", marketName: "Bitcoin Prediction Market", shares: 2.5, entryPrice: 42000, currentPrice: 45800, pnl: 9500, pnlPercent: 9.05 },
  { id: "2", symbol: "ETH", marketId: "eth", marketName: "Ethereum Prediction Market", shares: 15, entryPrice: 2200, currentPrice: 2350, pnl: 2250, pnlPercent: 6.82 },
  { id: "3", symbol: "POLITICS-2024", marketId: "pol-2024", marketName: "2024 Election Winner", shares: 500, entryPrice: 0.52, currentPrice: 0.58, pnl: 3000, pnlPercent: 11.54 },
  { id: "4", symbol: "TECH-Q4", marketId: "tech-q4", marketName: "Tech Earnings Beat Q4", shares: 1000, entryPrice: 0.45, currentPrice: 0.38, pnl: -7000, pnlPercent: -15.56 },
  { id: "5", symbol: "AI-2025", marketId: "ai-2025", marketName: "AI Advancement 2025", shares: 750, entryPrice: 0.65, currentPrice: 0.72, pnl: 5250, pnlPercent: 10.77 },
];

const MOCK_TRANSACTIONS = [
  { id: "1", type: "buy", asset: "BTC", amount: 0.5, price: 45200, total: 22600, timestamp: "2024-01-15T14:32:00" },
  { id: "2", type: "sell", asset: "ETH", amount: 3, price: 2380, total: 7140, timestamp: "2024-01-15T12:15:00" },
  { id: "3", type: "buy", asset: "POLITICS-2024", amount: 200, price: 0.55, total: 110, timestamp: "2024-01-14T16:45:00" },
  { id: "4", type: "buy", asset: "AI-2025", amount: 150, price: 0.68, total: 102, timestamp: "2024-01-14T10:20:00" },
  { id: "5", type: "sell", asset: "TECH-Q4", amount: 250, price: 0.42, total: 105, timestamp: "2024-01-13T15:30:00" },
];

function formatCurrency(num: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(num);
}
function formatPercent(num: number): string {
  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}
function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
}
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PortfolioPage() {
  const totalValue = 124532.88;
  const availableBalance = 24532.88;
  const todayPnl = 2847.52;
  const todayPnlPercent = 2.34;
  const totalPositions = MOCK_HOLDINGS.length;


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-gray-200">PORTFOLIO</h1>
          <p className="text-xs text-gray-500 mt-1">Position management and asset overview</p>
        </div>
        <Badge variant="success" pulse><Activity size={10} />LIVE</Badge>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-green/20 rounded border border-accent-green/30"><Wallet size={20} className="text-accent-green" /></div>
            <div><p className="text-xs text-gray-500 font-mono">PORTFOLIO VALUE</p><p className="text-lg font-mono font-bold text-accent-green">{formatCurrency(totalValue)}</p></div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-cyan/20 rounded border border-accent-cyan/30"><DollarSign size={20} className="text-accent-cyan" /></div>
            <div><p className="text-xs text-gray-500 font-mono">AVAILABLE BALANCE</p><p className="text-lg font-mono font-bold text-accent-cyan">{formatCurrency(availableBalance)}</p></div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded border ${todayPnl >= 0 ? "bg-accent-green/20 border-accent-green/30" : "bg-accent-red/20 border-accent-red/30"}`}>
              {todayPnl >= 0 ? <TrendingUp size={20} className="text-accent-green" /> : <TrendingDown size={20} className="text-accent-red" />}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono">TODAY&apos;S P&L</p>
              <p className={`text-lg font-mono font-bold ${todayPnl >= 0 ? "text-accent-green" : "text-accent-red"}`}>{formatCurrency(todayPnl)}</p>
              <p className={`text-xs font-mono ${todayPnl >= 0 ? "text-accent-green" : "text-accent-red"}`}>{formatPercent(todayPnlPercent)}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-amber/20 rounded border border-accent-amber/30"><Briefcase size={20} className="text-accent-amber" /></div>
            <div><p className="text-xs text-gray-500 font-mono">TOTAL POSITIONS</p><p className="text-lg font-mono font-bold text-accent-amber">{totalPositions}</p></div>
          </div>
        </Card>
      </div>

      <Card title="HOLDINGS" subtitle="Current positions and performance" headerActions={<Badge variant="info"><Briefcase size={10} />{totalPositions} POSITIONS</Badge>}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-terminal-border">
                <th className="text-left text-xs font-mono text-gray-500 pb-2">ASSET</th>
                <th className="text-right text-xs font-mono text-gray-500 pb-2">QUANTITY</th>
                <th className="text-right text-xs font-mono text-gray-500 pb-2">AVG COST</th>
                <th className="text-right text-xs font-mono text-gray-500 pb-2">CURRENT PRICE</th>
                <th className="text-right text-xs font-mono text-gray-500 pb-2">MARKET VALUE</th>
                <th className="text-right text-xs font-mono text-gray-500 pb-2">P&L</th>
                <th className="text-right text-xs font-mono text-gray-500 pb-2">P&L %</th>
                <th className="text-right text-xs font-mono text-gray-500 pb-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-terminal-border">
              {MOCK_HOLDINGS.map((holding) => {
                const marketValue = holding.shares * holding.currentPrice;
                return (
                  <tr key={holding.id} className="hover:bg-terminal-hover/50">
                    <td className="py-3"><div className="flex items-center gap-2"><span className="font-mono text-sm font-semibold text-gray-200">{holding.symbol}</span><span className="text-xs text-gray-500 truncate max-w-[150px]">{holding.marketName}</span></div></td>
                    <td className="text-right font-mono text-sm text-gray-200">{formatNumber(holding.shares, 4)}</td>
                    <td className="text-right font-mono text-sm text-gray-200">{formatCurrency(holding.entryPrice)}</td>
                    <td className="text-right font-mono text-sm text-gray-200">{formatCurrency(holding.currentPrice)}</td>
                    <td className="text-right font-mono text-sm text-accent-cyan">{formatCurrency(marketValue)}</td>
                    <td className={`text-right font-mono text-sm ${holding.pnl >= 0 ? "text-accent-green" : "text-accent-red"}`}>{formatCurrency(holding.pnl)}</td>
                    <td className="text-right"><div className="flex items-center justify-end gap-1">{holding.pnl >= 0 ? <TrendingUp size={12} className="text-accent-green" /> : <TrendingDown size={12} className="text-accent-red" />}<span className={`font-mono text-sm ${holding.pnl >= 0 ? "text-accent-green" : "text-accent-red"}`}>{formatPercent(holding.pnlPercent)}</span></div></td>
                    <td className="text-right"><button className="px-2 py-1 text-xs font-mono bg-accent-cyan/20 text-accent-cyan rounded border border-accent-cyan/30 hover:bg-accent-cyan/30 transition-colors">Trade</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="RECENT TRANSACTIONS" subtitle="Buy/sell activity" headerActions={<Badge variant="default">{MOCK_TRANSACTIONS.length} TRANSACTIONS</Badge>}>
        <div className="space-y-2">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded border border-terminal-border hover:border-terminal-hover transition-colors">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded ${tx.type === "buy" ? "bg-accent-green/20 border border-accent-green/30" : "bg-accent-red/20 border border-accent-red/30"}`}>
                  {tx.type === "buy" ? <ArrowUpRight size={16} className="text-accent-green" /> : <ArrowDownRight size={16} className="text-accent-red" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={tx.type === "buy" ? "success" : "danger"}>{tx.type.toUpperCase()}</Badge>
                    <span className="font-mono text-sm font-semibold text-gray-200">{tx.asset}</span>
                    <span className="text-xs text-gray-500">{formatNumber(tx.amount, 4)} shares @ {formatCurrency(tx.price)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-xs text-gray-400">{formatCurrency(tx.total)}</span>
                    <span className="text-xs text-gray-500">{formatDate(tx.timestamp)} {formatTime(tx.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}