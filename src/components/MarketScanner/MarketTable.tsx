import React, { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Market } from './types';
import { Exchange, Category } from '../MarketScanner/types';

interface MarketTableProps { markets: Market[]; onMarketClick: (market: Market) => void; }

const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};
const formatPercentage = (value: number): string => `${(value * 100).toFixed(1)}%`;


const CategoryBadge: React.FC<{ category: Category }> = ({ category }) => {
  const colors: Record<Category, string> = {
    Crypto: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Politics: 'bg-red-500/20 text-red-400 border-red-500/30',
    Sports: 'bg-green-500/20 text-green-400 border-green-500/30',
    Economics: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Entertainment: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Technology: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };
  return <span className={`px-2 py-0.5 text-xs rounded border ${colors[category]}`}>{category}</span>;
};

const ExchangeBadge: React.FC<{ exchange: Exchange }> = ({ exchange }) => {
  const colors: Record<Exchange, string> = {
    Polymarket: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Kalshi: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  };
  return <span className={`px-2 py-0.5 text-xs rounded border ${colors[exchange]}`}>{exchange}</span>;
};

const EdgeIndicator: React.FC<{ score: number }> = ({ score }) => {
  const getColor = (s: number) => s >= 70 ? 'text-terminal-green' : s >= 40 ? 'text-terminal-yellow' : 'text-terminal-muted';
  return <div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-terminal-dark rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${score >= 70 ? 'bg-terminal-green' : score >= 40 ? 'bg-terminal-yellow' : 'bg-terminal-muted'}`} style={{ width: `${score}%` }} /></div><span className={`text-sm font-semibold tabular-nums ${getColor(score)}`}>{score.toFixed(0)}</span></div>;
};

const PriceCell: React.FC<{ price: number; change: number }> = ({ price, change }) => {
  const isPositive = change >= 0;
  return <div className="flex flex-col"><span className="text-sm font-semibold tabular-nums">{formatPercentage(price)}</span><span className={`text-xs tabular-nums ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>{isPositive ? '+' : ''}{(change * 100).toFixed(1)}%</span></div>;
};

const LiveIndicator: React.FC = () => (
  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green"></span></span>
);

const MarketRow: React.FC<{ market: Market; onClick: () => void; style: React.CSSProperties }> = ({ market, onClick, style }) => {
  return (
    <div style={style} className="absolute top-0 left-0 w-full border-b border-terminal-border/50 hover:border-terminal-border transition-colors">
      <div onClick={onClick} className="flex items-center px-4 py-3 cursor-pointer hover:bg-terminal-panel transition-colors group">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1"><LiveIndicator /><h3 className="text-sm font-medium text-terminal-text truncate group-hover:text-terminal-green transition-colors">{market.question}</h3></div>
          <div className="flex items-center gap-2"><CategoryBadge category={market.category} /><ExchangeBadge exchange={market.exchange} />{market.tags.slice(0, 2).map(tag => <span key={tag} className="text-xs text-terminal-muted">#{tag}</span>)}</div>
        </div>
        <div className="w-32 flex items-center gap-4">
          <div className="flex flex-col items-end"><span className="text-xs text-terminal-muted mb-0.5">YES</span><PriceCell price={market.yesPrice} change={market.change24h} /></div>
          <div className="flex flex-col items-end"><span className="text-xs text-terminal-muted mb-0.5">NO</span><span className="text-sm font-semibold tabular-nums text-terminal-text">{formatPercentage(market.noPrice)}</span></div>
        </div>
        <div className="w-28 text-right"><span className="text-sm font-semibold tabular-nums text-terminal-text">{formatCurrency(market.volume24h)}</span></div>
        <div className="w-36 flex justify-end pr-4"><EdgeIndicator score={market.edgeScore} /></div>
        <div className="w-24 text-right"><ExchangeBadge exchange={market.exchange} /></div>
      </div>
    </div>
  );
};

export const MarketTable: React.FC<MarketTableProps> = ({ markets, onMarketClick }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({ count: markets.length, getScrollElement: () => parentRef.current, estimateSize: () => 72, overscan: 10 });
  const sortedMarkets = useMemo(() => [...markets].sort((a, b) => b.volume24h - a.volume24h), [markets]);

  return (
    <div className="flex flex-col h-full bg-terminal-dark rounded-lg border border-terminal-border overflow-hidden">
      <div className="flex items-center px-4 py-3 bg-terminal-panel border-b border-terminal-border">
        <div className="flex-1 min-w-0 pr-4"><span className="text-xs font-semibold uppercase tracking-wider text-terminal-muted">Market / Question</span></div>
        <div className="w-32"><span className="text-xs font-semibold uppercase tracking-wider text-terminal-muted">YES / NO</span></div>
        <div className="w-28 text-right"><span className="text-xs font-semibold uppercase tracking-wider text-terminal-muted">24h Volume</span></div>
        <div className="w-36 text-right pr-4"><span className="text-xs font-semibold uppercase tracking-wider text-terminal-muted">Edge Score</span></div>
        <div className="w-24 text-right"><span className="text-xs font-semibold uppercase tracking-wider text-terminal-muted">Exchange</span></div>
      </div>
      <div ref={parentRef} className="flex-1 overflow-auto" style={{ contain: 'strict' }}>
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map(virtualRow => (
            <MarketRow key={sortedMarkets[virtualRow.index].id} market={sortedMarkets[virtualRow.index]} onClick={() => onMarketClick(sortedMarkets[virtualRow.index])} style={{ height: `${virtualRow.size}px`, transform: `translateY(${virtualRow.start}px)` }} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2 bg-terminal-panel border-t border-terminal-border">
        <span className="text-xs text-terminal-muted">Showing {markets.length.toLocaleString()} markets</span>
        <span className="text-xs text-terminal-green flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse"></span>Live</span>
      </div>
    </div>
  );
};