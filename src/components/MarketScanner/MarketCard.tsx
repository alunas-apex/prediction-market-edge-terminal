import React, { useMemo } from 'react';
import { Market } from './types';
import { MiniChart } from './MiniChart';

interface MarketCardProps { market: Market; onClick: () => void; }
const formatCurrency = (value: number): string => value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : `$${value.toFixed(0)}`;
const formatPercentage = (value: number): string => `${(value * 100).toFixed(1)}%`;

export const MarketCard: React.FC<MarketCardProps> = ({ market, onClick }) => {
  const isPositive = market.change24h >= 0;
  const priceColor = isPositive ? 'text-terminal-green' : 'text-terminal-red';
  const priceData = useMemo(() => market.priceHistory.map(p => p.yesPrice), [market.priceHistory]);

  return (
    <div onClick={onClick} className="bg-terminal-dark border border-terminal-border rounded-lg p-4 cursor-pointer hover:border-terminal-green/50 hover:shadow-lg hover:shadow-terminal-green/5 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1"><span className={`w-2 h-2 rounded-full ${isPositive ? 'bg-terminal-green' : 'bg-terminal-red'} animate-pulse`}></span><span className="text-xs text-terminal-muted uppercase tracking-wider">{market.exchange}</span></div>
          <h3 className="text-sm font-medium text-terminal-text leading-tight group-hover:text-terminal-green transition-colors line-clamp-2">{market.question}</h3>
        </div>
        <div className={`text-lg font-bold tabular-nums ${priceColor}`}>{formatPercentage(market.yesPrice)}</div>
      </div>
      <div className="h-16 mb-3 rounded overflow-hidden"><MiniChart data={priceData} positive={isPositive} /></div>
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-terminal-border/50">
        <div><span className="text-xs text-terminal-muted block mb-0.5">24h Vol</span><span className="text-sm font-semibold tabular-nums text-terminal-text">{formatCurrency(market.volume24h)}</span></div>
        <div><span className="text-xs text-terminal-muted block mb-0.5">Edge</span><span className={`text-sm font-bold tabular-nums ${market.edgeScore >= 70 ? 'text-terminal-green' : market.edgeScore >= 40 ? 'text-terminal-yellow' : 'text-terminal-muted'}`}>{market.edgeScore.toFixed(0)}</span></div>
        <div><span className="text-xs text-terminal-muted block mb-0.5">Liq</span><span className="text-sm font-semibold tabular-nums text-terminal-text">{formatCurrency(market.liquidity)}</span></div>
      </div>
      <div className="flex flex-wrap gap-1 mt-3">{market.tags.slice(0, 3).map(tag => <span key={tag} className="px-1.5 py-0.5 text-xs bg-terminal-panel rounded text-terminal-muted">#{tag}</span>)}</div>
    </div>
  );
};