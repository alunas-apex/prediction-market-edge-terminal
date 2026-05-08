"use client";
import React, { useState } from "react";
import { Activity, ArrowLeftRight, DollarSign, BarChart3, RefreshCw, Zap, CheckCircle2, Clock } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { ArbitrageResult, ArbitrageResultData } from "@/components/ArbitrageResult";
import { ArbitrageScanner } from "@/components/ArbitrageScanner";
import { SpreadMatrix, MOCK_SPREAD_DATA } from "@/components/SpreadMatrix";
import { MOCK_ARBITRAGE, MOCK_MARKETS } from "@/lib/constants";
import type { SpreadData } from "@/components/SpreadMatrix";

function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
}

export default function ArbitragePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<string>("2026-05-09T03:06:00Z");
  const [arbitrageResult, setArbitrageResult] = useState<ArbitrageResultData | null>(null);
  const [spreadData] = useState<SpreadData[]>(MOCK_SPREAD_DATA);

  const activeOpportunities = MOCK_ARBITRAGE.length;
  const totalPotentialProfit = MOCK_ARBITRAGE.reduce((sum, arb) => sum + arb.profitPercent, 0);
  const averageConfidence = MOCK_ARBITRAGE.reduce((sum, arb) => sum + arb.confidence, 0) / MOCK_ARBITRAGE.length;
  const marketsMonitored = MOCK_MARKETS.length;

  const handleScan = (url: string, model: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime(new Date().toISOString());
      setArbitrageResult({ hasOpportunity: true, strategy: { action: "BUY_YES", yesPlatform: "Kalshi", noPlatform: "Polymarket", yesPrice: 0.68, noPrice: 0.32 }, profit: { grossProfit: 8.2, netProfit: 6.4, roi: 12.8, breakEven: 0.34 }, riskFactors: { liquidityRisk: "MEDIUM", timingRisk: "LOW", marketRisk: "LOW", regulatoryRisk: "LOW" }, executionSteps: ["Place buy order for YES shares on Kalshi at 68 cents", "Simultaneously place buy order for NO shares on Polymarket at 32 cents", "Lock in 8.2% gross profit margin", "Wait for market resolution", "Collect winnings on the YES outcome"], marketData: spreadData[0] });
    }, 2000);
  };

  const handleRefresh = () => {
    setIsScanning(true);
    setTimeout(() => { setIsScanning(false); setLastScanTime(new Date().toISOString()); }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-mono font-bold text-gray-200">ARBITRAGE SCANNER</h1><p className="text-xs text-gray-500 mt-1">Cross-exchange opportunity detection</p></div>
        <div className="flex items-center gap-3">
          <Badge variant="success" pulse><Activity size={10} />LIVE</Badge>
          <button onClick={handleRefresh} disabled={isScanning} className={`flex items-center gap-2 px-3 py-1.5 rounded border border-terminal-border text-xs font-mono text-gray-400 hover:text-gray-200 hover:border-terminal-hover transition-all duration-300 ${isScanning ? "opacity-50 cursor-not-allowed" : ""}`}><RefreshCw size={12} className={isScanning ? "animate-spin" : ""} />REFRESH</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="!p-3"><div className="flex items-center gap-3"><div className="flex items-center justify-center w-10 h-10 bg-accent-amber/20 rounded border border-accent-amber/30"><ArrowLeftRight size={20} className="text-accent-amber" /></div><div><p className="text-xs text-gray-500 font-mono">ACTIVE OPPORTUNITIES</p><p className="text-lg font-mono font-bold text-accent-amber">{activeOpportunities}</p></div></div></Card>
        <Card className="!p-3"><div className="flex items-center gap-3"><div className="flex items-center justify-center w-10 h-10 bg-accent-green/20 rounded border border-accent-green/30"><DollarSign size={20} className="text-accent-green" /></div><div><p className="text-xs text-gray-500 font-mono">TOTAL POTENTIAL PROFIT</p><p className="text-lg font-mono font-bold text-accent-green">+{formatNumber(totalPotentialProfit, 1)}%</p></div></div></Card>
        <Card className="!p-3"><div className="flex items-center gap-3"><div className="flex items-center justify-center w-10 h-10 bg-accent-cyan/20 rounded border border-accent-cyan/30"><BarChart3 size={20} className="text-accent-cyan" /></div><div><p className="text-xs text-gray-500 font-mono">AVG CONFIDENCE</p><p className="text-lg font-mono font-bold text-accent-cyan">{(averageConfidence * 100).toFixed(0)}%</p></div></div></Card>
        <Card className="!p-3"><div className="flex items-center gap-3"><div className="flex items-center justify-center w-10 h-10 bg-accent-blue/20 rounded border border-accent-blue/30"><Activity size={20} className="text-accent-blue" /></div><div><p className="text-xs text-gray-500 font-mono">MARKETS MONITORED</p><p className="text-lg font-mono font-bold text-accent-blue">{marketsMonitored}</p></div></div></Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1"><ArbitrageScanner onScan={handleScan} isScanning={isScanning} /></div>
        <div className="col-span-2"><SpreadMatrix data={spreadData} isLoading={isScanning} /></div>
      </div>

      <Card title="ACTIVE ARBITRAGE OPPORTUNITIES" subtitle="Detailed analysis of detected opportunities" headerActions={<div className="flex items-center gap-2"><Badge variant="warning"><ArrowLeftRight size={10} />{MOCK_ARBITRAGE.length} ACTIVE</Badge><div className="flex items-center gap-1 text-xs text-gray-500"><Clock size={10} />Last scan: {formatTime(lastScanTime)}</div></div>}>
        <div className="space-y-4">
          {MOCK_ARBITRAGE.map((arb, index) => (
            <div key={arb.id} className={`p-4 rounded-lg border transition-all duration-300 ${index === 0 ? "border-accent-green/30 bg-accent-green/5" : "border-terminal-border bg-terminal-hover/30"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${index === 0 ? "bg-accent-green/20" : "bg-accent-amber/20"}`}>{index === 0 ? <CheckCircle2 size={24} className="text-accent-green" /> : <Zap size={24} className="text-accent-amber" />}</div>
                  <div>
                    <div className="flex items-center gap-3"><span className="font-mono text-base font-bold text-gray-200">{arb.marketA} to {arb.marketB}</span><Badge variant={index === 0 ? "success" : "warning"}>{arb.confidence >= 0.85 ? "HIGH CONFIDENCE" : "MEDIUM CONFIDENCE"}</Badge></div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500"><span>Spread: {(arb.priceDiff * 100).toFixed(1)}%</span><span>Expires: {new Date(arb.expiration).toLocaleDateString()}</span><span>Confidence: {(arb.confidence * 100).toFixed(0)}%</span></div>
                  </div>
                </div>
                <div className="text-right"><div className={`font-mono text-xl font-bold ${index === 0 ? "text-accent-green" : "text-accent-amber"}`}>+{arb.profitPercent.toFixed(1)}%</div><div className="text-xs text-gray-500">Potential Profit</div></div>
              </div>
              <div className="mt-4 p-3 rounded bg-terminal-bg border border-terminal-border">
                <div className="flex items-center gap-2 mb-2"><span className="text-xs text-gray-500 font-mono uppercase">Recommended Action:</span></div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-accent-green/10 border border-accent-green/30"><span className="text-xs font-mono text-accent-green">BUY YES on {arb.marketA}</span></div>
                    <ArrowLeftRight size={14} className="text-gray-500" />
                    <div className="px-2 py-1 rounded bg-accent-red/10 border border-accent-red/30"><span className="text-xs font-mono text-accent-red">BUY NO on {arb.marketB}</span></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4"><ArbitrageResult result={arbitrageResult} isLoading={isScanning} /></div>
    </div>
  );
}