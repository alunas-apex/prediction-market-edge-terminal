import React, { useMemo, useState } from 'react';
import { PricePoint } from './types';

interface PriceChartProps {
  data: PricePoint[];
  width?: number;
  height?: number;
}


type TimeRange = '1H' | '24H' | '7D' | '30D' | 'ALL';

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  width = 800,
  height = 300,
}) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24H');

  const filteredData = useMemo(() => {
    const now = Date.now();
    const ranges: Record<TimeRange, number> = {
      '1H': 3600000,
      '24H': 86400000,
      '7D': 604800000,
      '30D': 2592000000,
      'ALL': Infinity,
    };

    const cutoff = now - ranges[selectedRange];
    return data.filter(p => p.timestamp >= cutoff);
  }, [data, selectedRange]);


  const { yesPath, noPath, yesAreaPath, noAreaPath, min, max, gridLines } = useMemo(() => {
    if (filteredData.length < 2) return { yesPath: '', noPath: '', yesAreaPath: '', noAreaPath: '', min: 0, max: 1, gridLines: [] };
    const prices = filteredData.flatMap(p => [p.yesPrice, p.noPrice]);
    const minVal = Math.max(0, Math.min(...prices) - 0.05);
    const maxVal = Math.min(1, Math.max(...prices) + 0.05);
    const range = maxVal - minVal || 0.001;


    const padding = { top: 20, right: 60, bottom: 30, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const pointsToPath = (points: Array<{ x: number; y: number }>, close = false) => {
      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx = (prev.x + curr.x) / 2;
        path += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
      }
      if (close) {
        path += ` L ${points[points.length - 1].x} ${chartHeight + padding.top}`;
        path += ` L ${points[0].x} ${chartHeight + padding.top} Z`;
      }
      return path;
    };


    const yesPoints = filteredData.map((p, i) => ({
      x: padding.left + (i / (filteredData.length - 1)) * chartWidth,
      y: padding.top + (1 - (p.yesPrice - minVal) / range) * chartHeight,
    }));

    const noPoints = filteredData.map((p, i) => ({
      x: padding.left + (i / (filteredData.length - 1)) * chartWidth,
      y: padding.top + (1 - (p.noPrice - minVal) / range) * chartHeight,
    }));

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(val => ({
      y: padding.top + (1 - val) * chartHeight,
      label: `${(val * 100).toFixed(0)}%`,
    }));

    return {
      yesPath: pointsToPath(yesPoints),
      noPath: pointsToPath(noPoints),
      yesAreaPath: pointsToPath(yesPoints, true),
      noAreaPath: pointsToPath(noPoints, true),
      min: minVal,
      max: maxVal,
      gridLines,
    };
  }, [filteredData, width, height]);

  const lastPrice = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;
  const firstPrice = filteredData.length > 0 ? filteredData[0] : null;
  const priceChange = lastPrice && firstPrice ? lastPrice.yesPrice - firstPrice.yesPrice : 0;


  const ranges: TimeRange[] = ['1H', '24H', '7D', '30D', 'ALL'];

  return (
    <div className="bg-terminal-dark border border-terminal-border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs text-terminal-muted uppercase tracking-wider">Current Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-terminal-text tabular-nums">
                {lastPrice ? `${(lastPrice.yesPrice * 100).toFixed(1)}%` : '-'}
              </span>
              <span className={`text-sm font-semibold tabular-nums ${
                priceChange >= 0 ? 'text-terminal-green' : 'text-terminal-red'
              }`}>
                {priceChange >= 0 ? '+' : ''}{(priceChange * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-1 bg-terminal-panel rounded-lg p-1">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 text-xs rounded transition-all ${
                selectedRange === range
                  ? 'bg-terminal-green text-terminal-black font-semibold'
                  : 'text-terminal-muted hover:text-terminal-text'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="noGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4757" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff4757" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1="10"
              y1={line.y}
              x2={width - 60}
              y2={line.y}
              stroke="#2a2e38"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <text
              x={width - 50}
              y={line.y + 4}
              fill="#4a5060"
              fontSize="10"
              textAnchor="start"
            >
              {line.label}
            </text>
          </g>
        ))}

        {/* YES Area */}
        <path
          d={yesAreaPath}
          fill="url(#yesGradient)"
          className="transition-opacity duration-300"
        />

        {/* NO Area */}
        <path
          d={noAreaPath}
          fill="url(#noGradient)"
          className="transition-opacity duration-300"
        />


        {/* YES Line */}
        <path
          d={yesPath}
          fill="none"
          stroke="#00d4aa"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* NO Line */}
        <path
          d={noPath}
          fill="none"
          stroke="#ff4757"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />


        {/* Current Price Dot */}
        {lastPrice && (
          <>
            <circle
              cx={width - 60}
              cy={20 + (1 - lastPrice.yesPrice) * (height - 50)}
              r="4"
              fill="#00d4aa"
              className="animate-pulse"
            />
            <line
              x1={10}
              y1={20 + (1 - lastPrice.yesPrice) * (height - 50)}
              x2={width - 60}
              y2={20 + (1 - lastPrice.yesPrice) * (height - 50)}
              stroke="#00d4aa"
              strokeWidth="1"
              strokeDasharray="2,2"
              opacity="0.3"
            />
          </>
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-terminal-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-terminal-green rounded"></div>
          <span className="text-sm text-terminal-text">YES</span>
          <span className="text-sm text-terminal-green font-semibold tabular-nums">
            {lastPrice ? `${(lastPrice.yesPrice * 100).toFixed(1)}%` : '-'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-terminal-red rounded opacity-60"></div>
          <span className="text-sm text-terminal-text">NO</span>
          <span className="text-sm text-terminal-red font-semibold tabular-nums">
            {lastPrice ? `${(lastPrice.noPrice * 100).toFixed(1)}%` : '-'}
          </span>
        </div>
      </div>
    </div>
  );
};