"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import type { AnalysisResult } from "@/types";

interface AnalysisOutputProps {
  results: AnalysisResult[];
}

function getActionStyle(action: "BUY YES" | "BUY NO" | "NO TRADE") {
  switch (action) {
    case "BUY YES":
      return {
        bg: "bg-accent-green/10",
        border: "border-accent-green",
        text: "text-accent-green",
        icon: ArrowUpRight,
      };
    case "BUY NO":
      return {
        bg: "bg-accent-red/10",
        border: "border-accent-red",
        text: "text-accent-red",
        icon: ArrowDownRight,
      };
    default:
      return {
        bg: "bg-gray-500/10",
        border: "border-gray-500",
        text: "text-gray-500",
        icon: Minus,
      };
  }
}

function getConfidenceStyle(score: number) {
  if (score >= 0.8)
    return { label: "High", color: "text-accent-green", bg: "bg-accent-green/20" };
  if (score >= 0.6)
    return { label: "Medium", color: "text-accent-amber", bg: "bg-accent-amber/20" };
  return { label: "Low", color: "text-accent-red", bg: "bg-accent-red/20" };
}

function getEdgeStyle(edge: number) {
  if (edge > 0.2) return { color: "text-accent-green", icon: TrendingUp };
  if (edge < -0.1) return { color: "text-accent-red", icon: TrendingDown };
  return { color: "text-accent-amber", icon: Minus };
}

function getImpactIcon(impact: "positive" | "negative" | "neutral") {
  switch (impact) {
    case "positive":
      return <ArrowUpRight className="w-3 h-3 text-accent-green" />;
    case "negative":
      return <ArrowDownRight className="w-3 h-3 text-accent-red" />;
    default:
      return <Minus className="w-3 h-3 text-gray-500" />;
  }
}

export default function AnalysisOutput({ results }: AnalysisOutputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-accent-cyan" />
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
          Analysis Results
        </h3>
        <span className="ml-auto text-xs text-gray-500">
          {results.length} markets analyzed
        </span>
      </div>

      {results.map((result) => {
        const actionStyle = getActionStyle(result.recommendedAction);
        const ActionIcon = actionStyle.icon;
        const resultConfidence = getConfidenceStyle(result.confidenceScore);
        const resultEdge = getEdgeStyle(result.edge);
        const ResultEdgeIcon = resultEdge.icon;
        return (
          <div
            key={result.id}
            className="bg-terminal-surface border border-terminal-border rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-terminal-bg px-4 py-3 border-b border-terminal-border">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h4 className="text-gray-200 font-medium text-sm leading-tight">
                    {result.marketQuestion}
                  </h4>
                  <p className="text-gray-500 text-xs mt-1 truncate">
                    {result.marketUrl}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`${resultConfidence.color} ${resultConfidence.bg} px-2 py-0.5 rounded`}
                  >
                    {resultConfidence.label} Confidence
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-4">
              {/* Probability Estimates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div className="bg-terminal-bg rounded p-3">
                  <div className="text-gray-500 text-xs uppercase mb-1">Market Price</div>
                  <div className="text-2xl font-bold text-gray-200">
                    {(result.marketPrice * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="bg-terminal-bg rounded p-3">
                  <div className="text-gray-500 text-xs uppercase mb-1">AI Estimate</div>
                  <div className="text-2xl font-bold text-accent-cyan">
                    {(result.aiEstimate * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="bg-terminal-bg rounded p-3">
                  <div className="text-gray-500 text-xs uppercase mb-1">Edge</div>
                  <div className={`text-2xl font-bold flex items-center gap-1 ${resultEdge.color}`}>
                    <ResultEdgeIcon className="w-5 h-5" />
                    {(result.edge * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="bg-terminal-bg rounded p-3">
                  <div className="text-gray-500 text-xs uppercase mb-1">Edge %</div>
                  <div className={`text-2xl font-bold ${resultEdge.color}`}>
                    {result.edge > 0 ? "+" : ""}
                    {result.edgePercentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Bull/Bear Cases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="bg-accent-green/5 border border-accent-green/30 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-accent-green" />
                    <span className="text-sm font-semibold text-accent-green uppercase">
                      Bull Case
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">{result.bullCase}</p>
                </div>
                <div className="bg-accent-red/5 border border-accent-red/30 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-accent-red" />
                    <span className="text-sm font-semibold text-accent-red uppercase">
                      Bear Case
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">{result.bearCase}</p>
                </div>
              </div>

              {/* Key Factors */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-accent-amber" />
                  <span className="text-sm font-semibold text-gray-200 uppercase">Key Factors</span>
                </div>
                <div className="space-y-2">
                  {result.keyFactors?.map((factor, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-terminal-bg rounded px-3 py-2"
                    >
                      <div className="w-6 h-6 rounded bg-terminal-surface flex items-center justify-center">
                        {getImpactIcon(factor.impact)}
                      </div>
                      <span className="flex-1 text-gray-200 text-sm">{factor.factor}</span>
                      <span
                        className={`text-xs font-mono ${
                          factor.weight > 0
                            ? "text-accent-green"
                            : factor.weight < 0
                            ? "text-accent-red"
                            : "text-gray-500"
                        }`}
                      >
                        {factor.weight > 0 ? "+" : ""}
                        {(factor.weight * 100).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div
                className={`flex items-center justify-between p-4 rounded border-2 ${actionStyle.bg} ${actionStyle.border}`}
              >
                <div className="flex items-center gap-3">
                  <ActionIcon className={`w-6 h-6 ${actionStyle.text}`} />
                  <div>
                    <div className={`text-xs uppercase font-semibold ${actionStyle.text}`}>
                      Recommended Action
                    </div>
                    <div className={`text-xl font-bold ${actionStyle.text}`}>
                      {result.recommendedAction}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Processing Time</div>
                  <div className="text-gray-200 font-mono">
                    {(result.processingTime / 1000).toFixed(1)}s
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-terminal-bg border-t border-terminal-border flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>{result.timestamp?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-accent-green" />
                <span>Analysis ID: {result.id.padStart(8, "0")}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Extended AnalysisResult type for AI Analysis (matches the component's needs)
interface AIAnalysisResult {
  id: string;
  marketUrl: string;
  marketQuestion: string;
  marketPrice: number;
  aiEstimate: number;
  edge: number;
  edgePercentage: number;
  bullCase: string;
  bearCase: string;
  keyFactors: Array<{
    factor: string;
    impact: "positive" | "negative" | "neutral";
    weight: number;
  }>;
  confidenceScore: number;
  recommendedAction: "BUY YES" | "BUY NO" | "NO TRADE";
  timestamp: Date;
  processingTime: number;
}

// Re-export the extended type
export type { AIAnalysisResult as AnalysisResult };