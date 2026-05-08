import React, { useState, useMemo, useCallback } from 'react';
import { Market, FilterState, Category, Exchange } from './types';
import { mockMarkets } from './mockData';
import { MarketTable } from './MarketTable';
import { MarketCard } from './MarketCard';
import { MarketFilters } from './MarketFilters';
import { PriceChart } from './PriceChart';

type ViewMode = 'table' | 'cards';

const defaultFilters: FilterState = {
  search: '',
  category: 'All',
  exchange: 'All',
  priceRange: { min: 0, max: 100 },
  showOnlyWithEdge: false,
};

export const MarketScanner: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [markets] = useState<Market[]>(mockMarkets);

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesQuestion = market.question.toLowerCase().includes(searchLower);
        const matchesTags = market.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesQuestion && !matchesTags) return false;
      }
      if (filters.category !== 'All' && market.category !== filters.category) return false;
      if (filters.exchange !== 'All' && market.exchange !== filters.exchange) return false;
      const yesPercentage = market.yesPrice * 100;
      if (yesPercentage < filters.priceRange.min || yesPercentage > filters.priceRange.max) return false;
      if (filters.showOnlyWithEdge && market.edgeScore < 50) return false;
      return true;
    });
  }, [markets, filters]);

  const handleMarketClick = useCallback((market: Market) => {
    setSelectedMarket(prev => prev?.id === market.id ? null : market);
  }, []);
  const handleCloseDetail = useCallback(() => { setSelectedMarket(null); }, []);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-terminal-text">Market Scanner</h1>
          <div className="flex items-center gap-1 px-2 py-1 bg-terminal-green/20 rounded">
            <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse"></span>
            <span className="text-xs text-terminal-green font-medium">LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-terminal-panel rounded-lg p-1">
          <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 text-sm rounded transition-all flex items-center gap-2 ${viewMode === 'table' ? 'bg-terminal-green text-terminal-black font-semibold' : 'text-terminal-muted hover:text-terminal-text'}`}>Table</button>
          <button onClick={() => setViewMode('cards')} className={`px-3 py-1.5 text-sm rounded transition-all flex items-center gap-2 ${viewMode === 'cards' ? 'bg-terminal-green text-terminal-black font-semibold' : 'text-terminal-muted hover:text-terminal-text'}`}>Cards</button>
        </div>
      </div>

      <MarketFilters filters={filters} onFilterChange={setFilters} totalMarkets={markets.length} filteredCount={filteredMarkets.length} />

      <div className="flex-1 flex gap-4 min-h-0">
        <div className={`flex-1 min-h-0 ${selectedMarket ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          {viewMode === 'table' ? <MarketTable markets={filteredMarkets} onMarketClick={handleMarketClick} /> : (
            <div className="h-full overflow-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMarkets.map((market) => <MarketCard key={market.id} market={market} onClick={() => handleMarketClick(market)} />)}
              </div>
            </div>
          )}
        </div>

        {selectedMarket && (
          <div className="w-1/3 flex flex-col gap-4 animate-in slide-in-from-right duration-300">
            <div className="bg-terminal-dark border border-terminal-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs rounded ${selectedMarket.exchange === 'Polymarket' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}>{selectedMarket.exchange}</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${selectedMarket.category === 'Crypto' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : selectedMarket.category === 'Politics' ? 'bg-red-500/20 text-red-400 border-red-500/30' : selectedMarket.category === 'Sports' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'}`}>{selectedMarket.category}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-terminal-text">{selectedMarket.question}</h2>
                </div>
                <button onClick={handleCloseDetail} className="p-1 text-terminal-muted hover:text-terminal-text transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <p className="text-sm text-terminal-muted mt-2">{selectedMarket.description}</p>
            </div>
            <div className="flex-1 min-h-0"><PriceChart data={selectedMarket.priceHistory} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-terminal-dark border border-terminal-border rounded-lg p-3"><span className="text-xs text-terminal-muted uppercase tracking-wider">24h Volume</span><p className="text-lg font-bold text-terminal-text tabular-nums">${selectedMarket.volume24h >= 1000000 ? `${(selectedMarket.volume24h / 1000000).toFixed(1)}M` : `${(selectedMarket.volume24h / 1000).toFixed(0)}K`}</p></div>
              <div className="bg-terminal-dark border border-terminal-border rounded-lg p-3"><span className="text-xs text-terminal-muted uppercase tracking-wider">Liquidity</span><p className="text-lg font-bold text-terminal-text tabular-nums">${selectedMarket.liquidity >= 1000000 ? `${(selectedMarket.liquidity / 1000000).toFixed(1)}M` : `${(selectedMarket.liquidity / 1000).toFixed(0)}K`}</p></div>
              <div className="bg-terminal-dark border border-terminal-border rounded-lg p-3"><span className="text-xs text-terminal-muted uppercase tracking-wider">Edge Score</span><p className={`text-lg font-bold tabular-nums ${selectedMarket.edgeScore >= 70 ? 'text-terminal-green' : selectedMarket.edgeScore >= 40 ? 'text-terminal-yellow' : 'text-terminal-muted'}`}>{selectedMarket.edgeScore.toFixed(0)}</p></div>
              <div className="bg-terminal-dark border border-terminal-border rounded-lg p-3"><span className="text-xs text-terminal-muted uppercase tracking-wider">24h Change</span><p className={`text-lg font-bold tabular-nums ${selectedMarket.change24h >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>{selectedMarket.change24h >= 0 ? '+' : ''}{(selectedMarket.change24h * 100).toFixed(1)}%</p></div>
            </div>
            <div className="flex flex-wrap gap-2">{selectedMarket.tags.map(tag => <span key={tag} className="px-2 py-1 text-xs bg-terminal-panel rounded text-terminal-muted">#{tag}</span>)}</div>
          </div>
        )}
      </div>
    </div>
  );
};