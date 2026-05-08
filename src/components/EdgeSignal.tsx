"use client";
import { useEffect, useState } from "react";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";

interface KeyFactor {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  weight: number;
}

interface AnalysisResult {
  id: string;
  marketUrl: string;
  marketQuestion: string;
  marketPrice: number;
  aiEstimate: number;
  edge: number;
  edgePercentage: number;
  bullCase: string;
  bearCase: string;
  keyFactors: KeyFactor[];
  confidenceScore: number;
  recommendedAction: "BUY YES" | "BUY NO" | "NO TRADE";
  timestamp: Date;
  processingTime: number;
}

interface EdgeSignalProps {
  result: AnalysisResult;
}

function calculateProfitPotential(marketPrice: number, aiEstimate: number, edge: number): number {
  const maxProfitPercent = Math.abs(edge) * 100;
  const impliedProfit = (Math.abs(marketPrice - aiEstimate) / Math.max(marketPrice, aiEstimate)) * 100;
  return Math.min(maxProfitPercent, impliedProfit * 2);
}

export default function EdgeSignal({ result }: EdgeSignalProps) {
  const [isGlowing, setIsGlowing] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    if (result.confidenceScore >= 0.8) {
      setIsGlowing(true);
      const interval = setInterval(() => {
        setPulsePhase((p) => (p + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [result.confidenceScore]);

  const isBullish = result.edge > 0;
  const profitPotential = calculateProfitPotential(result.marketPrice, result.aiEstimate, result.edge);
  const glowStyle = isBullish
    ? {
        border: "border-accent-green",
        glowClass: "edge-glow-green",
        icon: ArrowUpRight,
        priceColor: "text-accent-green",
        bgGradient: "from-accent-green/10 to-accent-green/5",
      }
    : {
        border: "border-accent-red",
        glowClass: "edge-glow-red",
        icon: ArrowDownRight,
        priceColor: "text-accent-red",
        bgGradient: "from-accent-red/10 to-accent-red/5",
      };
  const SignalIcon = glowStyle.icon;
  const marketPricePercent = (result.marketPrice * 100).toFixed(0);
  const aiEstimatePercent = (result.aiEstimate * 100).toFixed(0);
  const edgePercent = (Math.abs(result.edge) * 100).toFixed(0);


  return (
    <div
      className={`relative bg-terminal-surface border-2 ${glowStyle.border} rounded-lg overflow-hidden transition-all duration-500 ${
        isGlowing ? glowStyle.glowClass : ""
      }`}
      style={{
        boxShadow: isGlowing ? `0 0 ${20 + pulsePhase / 10}px currentColor` : undefined,
      }}
    >
      {/* Animated Scan Line for High Confidence */}
      {result.confidenceScore >= 0.8 && (
        <div className="scan-line">
          <div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-40"
            style={{
              animation: "scan 2s linear infinite",
              top: `${pulsePhase}%`,
            }}
          />
        </div>
      )}

      {/* Header */}
      <div
        className={`bg-gradient-to-r ${glowStyle.bgGradient} px-4 py-3 border-b border-terminal-border`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded flex items-center justify-center ${
                isBullish ? "bg-accent-green/20" : "bg-accent-red/20"
              }`}
            >
              <SignalIcon className={`w-5 h-5 ${glowStyle.priceColor}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent-cyan" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-200">
                  Edge Signal
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Confidence: {(result.confidenceScore * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Profit Potential Badge */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-accent-amber">
              <Target className="w-4 h-4" />
              <span className="text-lg font-bold">{profitPotential.toFixed(1)}%</span>
            </div>
            <div className="text-xs text-gray-500">Profit Potential</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Question */}
        <p className="text-gray-200 font-medium text-sm mb-4 leading-snug">
          {result.marketQuestion}
        </p>

        {/* Price Comparison */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-terminal-bg rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase">Market</span>
            </div>
            <div className={`text-xl font-bold font-mono ${glowStyle.priceColor}`}>
              {marketPricePercent}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Current Price</div>
          </div>

          <div className="bg-terminal-bg rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3 h-3 text-accent-cyan" />
              <span className="text-xs text-accent-cyan uppercase">AI Est.</span>
            </div>
            <div className="text-xl font-bold font-mono text-accent-cyan">
              {aiEstimatePercent}%
            </div>
            <div className="text-xs text-gray-500 mt-1">AI Estimate</div>
          </div>
        </div>

        {/* Edge Display */}
        <div
          className={`flex items-center justify-between p-3 rounded ${
            isBullish ? "bg-accent-green/10" : "bg-accent-red/10"
          }`}
        >
          <div className="flex items-center gap-2">
            {isBullish ? (
              <TrendingUp className="w-5 h-5 text-accent-green" />
            ) : (
              <TrendingDown className="w-5 h-5 text-accent-red" />
            )}
            <span className="text-sm text-gray-200">
              {isBullish ? "Bullish Edge Detected" : "Bearish Edge Detected"}
            </span>
          </div>
          <div className={`text-lg font-bold font-mono ${glowStyle.priceColor}`}>
            {isBullish ? "+" : "-"}
            {edgePercent}%
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div
        className={`px-4 py-2 bg-gradient-to-r ${glowStyle.bgGradient} border-t border-terminal-border`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold uppercase ${
                result.recommendedAction === "BUY YES"
                  ? "text-accent-green"
                  : result.recommendedAction === "BUY NO"
                  ? "text-accent-red"
                  : "text-gray-500"
              }`}
            >
              {result.recommendedAction}
            </span>
            <span className="text-xs text-gray-500">recommended</span>
          </div>
          <div className="text-xs text-gray-500">
            Processed in {(result.processingTime / 1000).toFixed(1)}s
          </div>
        </div>
      </div>

      {/* Pulsing Border Effect for Very High Confidence */}
      {result.confidenceScore >= 0.9 && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none animate-pulse"
          style={{
            boxShadow: `inset 0 0 20px ${
              isBullish ? "rgba(0,255,136,0.3)" : "rgba(255,51,102,0.3)"
            }`,
          }}
        />
      )}
    </div>
  );
}