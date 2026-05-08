"use client";

import React from "react";
import { Brain, AlertCircle } from "lucide-react";
import { Card, Badge } from "@/components/ui";

export default function AIAnalysisPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-gray-200">AI ANALYSIS</h1>
          <p className="text-xs text-gray-500 mt-1">Multi-agent market analysis with edge detection</p>
        </div>
        <Badge variant="info"><Brain size={10} />COMING SOON</Badge>
      </div>

      <Card title="ANALYSIS ENGINE" subtitle="AI-powered market analysis">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-terminal-hover rounded-full mb-4">
            <AlertCircle size={32} className="text-gray-500" />
          </div>
          <h3 className="font-mono text-lg font-semibold text-gray-200 mb-2">Analysis Module</h3>
          <p className="text-sm text-gray-500 max-w-md">
            The AI analysis engine is being prepared. This module will provide real-time market analysis, edge detection, and multi-agent orchestration for prediction markets.
          </p>
        </div>
      </Card>
    </div>
  );
}