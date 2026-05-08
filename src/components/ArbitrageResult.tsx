import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight,
  Zap,
  BarChart3,
} from 'lucide-react';
import type { SpreadData } from './SpreadMatrix';

export interface ArbitrageResultData {
  hasOpportunity: boolean;
  strategy: {
    action: 'BUY_YES' | 'BUY_NO';
    yesPlatform: 'Polymarket' | 'Kalshi';
    noPlatform: 'Polymarket' | 'Kalshi';
    yesPrice: number;
    noPrice: number;
  };
  profit: {
    grossProfit: number;
    netProfit: number;
    roi: number;
    breakEven: number;
  };
  riskFactors: {
    liquidityRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    timingRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    marketRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    regulatoryRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  executionSteps: string[];
  marketData: SpreadData;
}

interface ArbitrageResultProps {
  result: ArbitrageResultData | null;
  isLoading?: boolean;
}

const MOCK_RESULT: ArbitrageResultData = {
  hasOpportunity: true,
  strategy: {
    action: 'BUY_YES',
    yesPlatform: 'Kalshi',
    noPlatform: 'Polymarket',
    yesPrice: 0.68,
    noPrice: 0.32,
  },
  profit: {
    grossProfit: 8.2,
    netProfit: 6.4,
    roi: 12.8,
    breakEven: 0.34,
  },
  riskFactors: {
    liquidityRisk: 'MEDIUM',
    timingRisk: 'LOW',
    marketRisk: 'LOW',
    regulatoryRisk: 'LOW',
  },
  executionSteps: [
    'Place buy order for YES shares on Kalshi at 68 cents',
    'Simultaneously place buy order for NO shares on Polymarket at 32 cents',
    'Lock in 8.2% gross profit margin',
    'Wait for market resolution',
    'Collect winnings on the YES outcome',
  ],
  marketData: {
    id: '1',
    question: 'Will S&P 500 reach 5500 by EOY 2024?',
    polymarketYes: 0.72,
    polymarketNo: 0.28,
    kalshiYes: 0.68,
    kalshiNo: 0.32,
    spread: 0.04,
    expectedValue: 8.2,
    recommendation: 'BUY_YES',
    confidence: 87,
    lastUpdated: '2 sec ago',
  },
};

export const ArbitrageResult: React.FC<ArbitrageResultProps> = ({ result, isLoading }) => {
  const displayResult = result || MOCK_RESULT;
  const getRiskColor = (risk: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (risk) {
      case 'LOW':
        return 'text-terminal-green bg-terminal-green/10 border-terminal-green/30';
      case 'MEDIUM':
        return 'text-terminal-yellow bg-terminal-yellow/10 border-terminal-yellow/30';
      case 'HIGH':
        return 'text-terminal-red bg-terminal-red/10 border-terminal-red/30';
    }
  };


  const getRiskIcon = (risk: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (risk) {
      case 'LOW':
        return <Shield className="w-3 h-3" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-3 h-3" />;
      case 'HIGH':
        return <XCircle className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="terminal-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-terminal-green border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-terminal-green">ARBITRAGE ANALYSIS</h2>
            <p className="text-xs text-terminal-border">Calculating opportunities...</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-24 rounded-lg shimmer" />
          <div className="h-32 rounded-lg shimmer" />
          <div className="h-20 rounded-lg shimmer" />
        </div>
      </div>
    );
  }

  if (!displayResult.hasOpportunity) {
    return (
      <div className="terminal-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-terminal-red/10 border border-terminal-red/30 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-terminal-red" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-terminal-red">ARBITRAGE ANALYSIS</h2>
            <p className="text-xs text-terminal-border">No profitable opportunity detected</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-terminal-red/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-terminal-red" />
          </div>
          <p className="text-terminal-muted text-sm">
            Current market prices do not present a profitable arbitrage opportunity.
          </p>
          <p className="text-terminal-muted text-xs mt-2">
            Try scanning a different market or wait for price movements.
          </p>
        </div>
      </div>
    );
  }

  const { strategy, profit, riskFactors, executionSteps, marketData } = displayResult;
  return (
    <div className="terminal-panel p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center animate-glow">
            <CheckCircle2 className="w-5 h-5 text-terminal-green" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-terminal-green">ARBITRAGE OPPORTUNITY</h2>
            <p className="text-xs text-terminal-border">Profit opportunity detected</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-terminal-green/10 border border-terminal-green/30">
          <Zap className="w-4 h-4 text-terminal-green" />
          <span className="text-sm font-semibold text-terminal-green">+{profit.netProfit}%</span>
        </div>
      </div>
      {/* Market Question */}
      <div className="mb-6 p-4 rounded-lg bg-terminal-black border border-terminal-border">
        <div className="text-[10px] text-terminal-muted uppercase mb-1">Market Question</div>
        <div className="text-sm text-terminal-text font-medium">{marketData.question}</div>
        <div className="flex items-center gap-4 mt-2 text-xs">
          <span className="text-terminal-muted">Confidence: {marketData.confidence}%</span>
          <span className="text-terminal-muted">Spread: {(marketData.spread * 100).toFixed(1)}%</span>
          <span className="text-terminal-muted">EV: +{marketData.expectedValue}%</span>
        </div>
      </div>

      {/* Strategy Display */}
      <div className="mb-6">
        <div className="text-xs text-terminal-muted uppercase mb-3 flex items-center gap-2">
          <BarChart3 className="w-3 h-3" />
          Recommended Strategy
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Buy Side */}
          <div className="p-4 rounded-lg bg-terminal-green/5 border border-terminal-green/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-terminal-green/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-terminal-green" />
              </div>
              <div>
                <div className="text-xs text-terminal-green">BUY {strategy.action === 'BUY_YES' ? 'YES' : 'NO'}</div>
                <div className="text-xs text-terminal-muted">{strategy.yesPlatform}</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-terminal-green">
              {(strategy.yesPrice * 100).toFixed(0)}c
            </div>
            <div className="text-xs text-terminal-muted mt-1">Entry price</div>
          </div>


          {/* Opposite Side */}
          <div className="p-4 rounded-lg bg-terminal-red/5 border border-terminal-red/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-terminal-red/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-terminal-red" style={{ transform: 'rotate(180deg)' }} />
              </div>
              <div>
                <div className="text-xs text-terminal-red">BUY {strategy.action === 'BUY_YES' ? 'NO' : 'YES'}</div>
                <div className="text-xs text-terminal-muted">{strategy.noPlatform}</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-terminal-red">
              {(strategy.noPrice * 100).toFixed(0)}c
            </div>
            <div className="text-xs text-terminal-muted mt-1">Opposite position</div>
          </div>
        </div>
      </div>

      {/* Profit Calculations */}
      <div className="mb-6">
        <div className="text-xs text-terminal-muted uppercase mb-3 flex items-center gap-2">
          <DollarSign className="w-3 h-3" />
          Profit Calculations
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded-lg bg-terminal-black border border-terminal-border text-center">
            <div className="text-lg font-bold text-terminal-green">+{profit.grossProfit}%</div>
            <div className="text-[10px] text-terminal-muted">Gross Profit</div>
          </div>
          <div className="p-3 rounded-lg bg-terminal-black border border-terminal-border text-center">
            <div className="text-lg font-bold text-terminal-green">+{profit.netProfit}%</div>
            <div className="text-[10px] text-terminal-muted">Net Profit</div>
          </div>
          <div className="p-3 rounded-lg bg-terminal-black border border-terminal-border text-center">
            <div className="text-lg font-bold text-terminal-blue">{profit.roi}%</div>
            <div className="text-[10px] text-terminal-muted">ROI</div>
          </div>
          <div className="p-3 rounded-lg bg-terminal-black border border-terminal-border text-center">
            <div className="text-lg font-bold text-terminal-yellow">{profit.breakEven}%</div>
            <div className="text-[10px] text-terminal-muted">Break Even</div>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="mb-6">
        <div className="text-xs text-terminal-muted uppercase mb-3 flex items-center gap-2">
          <Shield className="w-3 h-3" />
          Risk Assessment
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(riskFactors).map(([key, value]) => (
            <div
              key={key}
              className={`flex items-center justify-between p-2 rounded-lg border ${getRiskColor(value)}`}
            >
              <div className="flex items-center gap-2">
                {getRiskIcon(value)}
                <span className="text-xs capitalize">{key.replace('Risk', '')}</span>
              </div>
              <span className="text-xs font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Execution Steps */}
      <div className="mb-6">
        <div className="text-xs text-terminal-muted uppercase mb-3 flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Execution Steps
        </div>
        <div className="space-y-2">
          {executionSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-terminal-green/20 border border-terminal-green/30 flex items-center justify-center text-xs font-semibold text-terminal-green">
                {index + 1}
              </div>
              <div className="flex-1 text-sm text-terminal-text">{step}</div>
              <ArrowRight className="w-3 h-3 text-terminal-muted" />
            </div>
          ))}
        </div>
      </div>

      {/* Execute Button */}
      <button className="w-full py-4 rounded-lg bg-terminal-green text-terminal-black font-semibold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-terminal-green/30 transition-all duration-300 flex items-center justify-center gap-3">
        <Zap className="w-5 h-5" />
        <span>Execute Arbitrage Strategy</span>
      </button>

      {/* Disclaimer */}
      <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-terminal-yellow/10 border border-terminal-yellow/30">
        <AlertTriangle className="w-4 h-4 text-terminal-yellow flex-shrink-0 mt-0.5" />
        <div className="text-xs text-terminal-yellow">
          <strong>Risk Warning:</strong> Arbitrage opportunities may disappear quickly due to market efficiency.
          Execution timing is critical. Past performance does not guarantee future results.
        </div>
      </div>
    </div>
  );
};