import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight, AlertTriangle } from 'lucide-react';

export interface SpreadData {
  id: string;
  question: string;
  polymarketYes: number;
  polymarketNo: number;
  kalshiYes: number;
  kalshiNo: number;
  spread: number;
  expectedValue: number;
  recommendation: 'BUY_YES' | 'BUY_NO' | 'NONE';
  confidence: number;
  lastUpdated: string;
}

// Mock data showing realistic arbitrage opportunities
export const MOCK_SPREAD_DATA: SpreadData[] = [
  {
    id: '1',
    question: 'Will S&P 500 reach 5500 by EOY 2024?',
    polymarketYes: 0.72,
    polymarketNo: 0.28,
    kalshiYes: 0.68,
    kalshiNo: 0.32,
    spread: 0.04,
    expectedValue: 5.9,
    recommendation: 'BUY_YES',
    confidence: 87,
    lastUpdated: '2 sec ago',
  },
  {
    id: '2',
    question: 'Will Fed cut rates 3+ times in 2024?',
    polymarketYes: 0.45,
    polymarketNo: 0.55,
    kalshiYes: 0.52,
    kalshiNo: 0.48,
    spread: 0.07,
    expectedValue: 8.2,
    recommendation: 'BUY_NO',
    confidence: 92,
    lastUpdated: '5 sec ago',
  },
  {
    id: '3',
    question: 'Will Bitcoin exceed $100K before 2025?',
    polymarketYes: 0.38,
    polymarketNo: 0.62,
    kalshiYes: 0.35,
    kalshiNo: 0.65,
    spread: 0.03,
    expectedValue: 4.1,
    recommendation: 'BUY_YES',
    confidence: 76,
    lastUpdated: '12 sec ago',
  },
  {
    id: '4',
    question: 'Will unemployment drop below 4%?',
    polymarketYes: 0.62,
    polymarketNo: 0.38,
    kalshiYes: 0.65,
    kalshiNo: 0.35,
    spread: 0.03,
    expectedValue: -2.1,
    recommendation: 'NONE',
    confidence: 81,
    lastUpdated: '30 sec ago',
  },
];

interface SpreadMatrixProps {
  data: SpreadData[];
  isLoading?: boolean;
}

export const SpreadMatrix: React.FC<SpreadMatrixProps> = ({ data, isLoading }) => {
  const formatPercent = (value: number): string => `${(value * 100).toFixed(1)}%`;


  const getRecommendationStyle = (rec: SpreadData['recommendation']) => {
    switch (rec) {
      case 'BUY_YES':
        return 'text-terminal-green';
      case 'BUY_NO':
        return 'text-terminal-red';
      default:
        return 'text-terminal-muted';
    }
  };

  const getRecommendationAction = (rec: SpreadData['recommendation'], spread: number, platform: 'poly' | 'kalshi') => {
    if (rec === 'NONE') return '-';
    const action = rec === 'BUY_YES' ? 'YES' : 'NO';
    const price = rec === 'BUY_YES'
      ? (platform === 'poly' ? MOCK_SPREAD_DATA[0].polymarketYes : MOCK_SPREAD_DATA[0].kalshiYes)
      : (platform === 'poly' ? MOCK_SPREAD_DATA[0].polymarketNo : MOCK_SPREAD_DATA[0].kalshiNo);
    return `Buy ${action} @ ${(price * 100).toFixed(0)}c on ${platform === 'poly' ? 'Poly' : 'Kalshi'}`;
  };


  if (isLoading) {
    return (
      <div className="terminal-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-terminal-blue/10 border border-terminal-blue/30 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-terminal-blue border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-terminal-blue">SPREAD MATRIX</h2>
            <p className="text-xs text-terminal-border">Loading market data...</p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-panel p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-terminal-blue/10 border border-terminal-blue/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-terminal-blue" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-terminal-blue">SPREAD MATRIX</h2>
            <p className="text-xs text-terminal-border">Polymarket vs Kalshi comparison</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
          <span className="text-xs text-terminal-muted">Live</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-terminal-green/20 border border-terminal-green/40" />
          <span className="text-terminal-muted">Positive EV</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-terminal-red/20 border border-terminal-red/40" />
          <span className="text-terminal-muted">Negative EV</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-terminal-yellow/20 border border-terminal-yellow/40" />
          <span className="text-terminal-muted">High spread</span>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className={`
              p-4 rounded-lg border transition-all duration-300 matrix-cell
              ${item.expectedValue > 0 ? 'positive-ev' : item.expectedValue < -2 ? 'negative-ev' : 'bg-terminal-black border-terminal-border'}
            `}
          >
            {/* Question Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-terminal-text leading-tight">
                  {item.question}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs ${getRecommendationStyle(item.recommendation)}`}>
                    {item.recommendation !== 'NONE' ? (
                      <>
                        {item.recommendation === 'BUY_YES' ? (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {getRecommendationAction(item.recommendation, item.spread, 'poly')}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            {getRecommendationAction(item.recommendation, item.spread, 'kalshi')}
                          </span>
                        )}
                      </>
                    ) : (
                      'No opportunity'
                    )}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`
                  px-2 py-1 rounded text-xs font-semibold
                  ${item.expectedValue > 0 ? 'bg-terminal-green/20 text-terminal-green' : 'bg-terminal-red/20 text-terminal-red'}
                `}>
                  {item.expectedValue > 0 ? '+' : ''}{item.expectedValue.toFixed(1)}% EV
                </div>
                <div className="text-[10px] text-terminal-muted flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-terminal-green" />
                  {item.lastUpdated}
                </div>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="grid grid-cols-4 gap-2">
              {/* Polymarket YES */}
              <div className="text-center p-2 rounded bg-terminal-black/50">
                <div className="text-[10px] text-terminal-muted mb-1">POLY YES</div>
                <div className="text-sm font-semibold text-terminal-green">
                  {formatPercent(item.polymarketYes)}
                </div>
              </div>
              {/* Polymarket NO */}
              <div className="text-center p-2 rounded bg-terminal-black/50">
                <div className="text-[10px] text-terminal-muted mb-1">POLY NO</div>
                <div className="text-sm font-semibold text-terminal-red">
                  {formatPercent(item.polymarketNo)}
                </div>
              </div>
              {/* Kalshi YES */}
              <div className="text-center p-2 rounded bg-terminal-black/50">
                <div className="text-[10px] text-terminal-muted mb-1">KALSHI YES</div>
                <div className="text-sm font-semibold text-terminal-green">
                  {formatPercent(item.kalshiYes)}
                </div>
              </div>
              {/* Kalshi NO */}
              <div className="text-center p-2 rounded bg-terminal-black/50">
                <div className="text-[10px] text-terminal-muted mb-1">KALSHI NO</div>
                <div className="text-sm font-semibold text-terminal-red">
                  {formatPercent(item.kalshiNo)}
                </div>
              </div>
            </div>

            {/* Spread Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-terminal-muted">Spread</span>
                <span className="text-terminal-yellow font-medium">{formatPercent(item.spread)}</span>
              </div>
              <div className="h-1.5 bg-terminal-black rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.spread > 0.05 ? 'bg-terminal-yellow' : 'bg-terminal-blue'
                  }`}
                  style={{ width: `${Math.min(item.spread * 500, 100)}%` }}
                />
              </div>
            </div>

            {/* Confidence */}
            <div className="flex items-center justify-between mt-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-terminal-muted">Confidence</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < Math.floor(item.confidence / 20)
                          ? 'bg-terminal-green'
                          : 'bg-terminal-muted/30'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-terminal-text font-medium">{item.confidence}%</span>
                </div>
              </div>
              {item.spread > 0.05 && (
                <div className="flex items-center gap-1 text-terminal-yellow">
                  <AlertTriangle className="w-3 h-3" />
                  <span>High spread alert</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-terminal-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-terminal-muted" />
            <span className="text-xs text-terminal-muted">Best opportunity:</span>
            <span className="text-sm font-semibold text-terminal-green">
              {data.find(d => d.expectedValue > 0)?.question.slice(0, 40) || 'None'}...
            </span>
          </div>
          <div className="text-xs text-terminal-muted">
            {data.filter(d => d.expectedValue > 0).length} / {data.length} opportunities
          </div>
        </div>
      </div>
    </div>
  );
};