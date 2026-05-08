import React from 'react';
import { FilterState, Category, Exchange } from './types';

interface MarketFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalMarkets: number;
  filteredCount: number;
}

const categories: Array<Category | 'All'> = [
  'All', 'Crypto', 'Politics', 'Sports', 'Economics', 'Entertainment', 'Technology'
];
const exchanges: Array<Exchange | 'All'> = ['All', 'Polymarket', 'Kalshi'];

export const MarketFilters: React.FC<MarketFiltersProps> = ({
  filters,
  onFilterChange,
  totalMarkets,
  filteredCount,
}) => {
  const handleCategoryChange = (category: Category | 'All') => {
    onFilterChange({ ...filters, category });
  };

  const handleExchangeChange = (exchange: Exchange | 'All') => {
    onFilterChange({ ...filters, exchange });
  };


  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search });
  };

  const handleMinPriceChange = (min: number) => {
    onFilterChange({ ...filters, priceRange: { ...filters.priceRange, min } });
  };

  const handleMaxPriceChange = (max: number) => {
    onFilterChange({ ...filters, priceRange: { ...filters.priceRange, max } });
  };

  const handleEdgeToggle = () => {
    onFilterChange({ ...filters, showOnlyWithEdge: !filters.showOnlyWithEdge });
  };

  return (
    <div className="bg-terminal-dark border border-terminal-border rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search markets..."
              className="w-full bg-terminal-panel border border-terminal-border rounded-lg 
                         pl-10 pr-4 py-2 text-sm text-terminal-text placeholder-terminal-muted
                         focus:outline-none focus:border-terminal-green/50 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-terminal-muted uppercase tracking-wider">Category</label>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  filters.category === cat
                    ? 'bg-terminal-green text-terminal-black font-semibold'
                    : 'bg-terminal-panel text-terminal-muted hover:text-terminal-text border border-terminal-border hover:border-terminal-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exchange Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-terminal-muted uppercase tracking-wider">Exchange</label>
          <div className="flex gap-1">
            {exchanges.map((ex) => (
              <button
                key={ex}
                onClick={() => handleExchangeChange(ex)}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  filters.exchange === ex
                    ? ex === 'Polymarket'
                      ? 'bg-orange-500 text-white font-semibold'
                      : 'bg-indigo-500 text-white font-semibold'
                    : 'bg-terminal-panel text-terminal-muted hover:text-terminal-text border border-terminal-border hover:border-terminal-muted'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
        {/* Price Range */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-terminal-muted uppercase tracking-wider">Price Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => handleMinPriceChange(Number(e.target.value))}
              min={0}
              max={100}
              placeholder="Min"
              className="w-16 bg-terminal-panel border border-terminal-border rounded px-2 py-1 
                         text-sm text-terminal-text placeholder-terminal-muted
                         focus:outline-none focus:border-terminal-green/50 transition-colors"
            />
            <span className="text-terminal-muted">-</span>
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
              min={0}
              max={100}
              placeholder="Max"
              className="w-16 bg-terminal-panel border border-terminal-border rounded px-2 py-1 
                         text-sm text-terminal-text placeholder-terminal-muted
                         focus:outline-none focus:border-terminal-green/50 transition-colors"
            />
            <span className="text-xs text-terminal-muted">%</span>
          </div>
        </div>

        {/* Edge Toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-terminal-muted uppercase tracking-wider">Edge Filter</label>
          <button
            onClick={handleEdgeToggle}
            className={`flex items-center gap-2 px-3 py-1 text-xs rounded transition-all border ${
              filters.showOnlyWithEdge
                ? 'bg-terminal-green/20 text-terminal-green border-terminal-green/50'
                : 'bg-terminal-panel text-terminal-muted border-terminal-border hover:border-terminal-muted'
            }`}
          >
            <svg
              className={`w-4 h-4 ${filters.showOnlyWithEdge ? 'text-terminal-green' : 'text-terminal-muted'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            High Edge Only
          </button>
        </div>

        {/* Stats */}
        <div className="ml-auto flex flex-col items-end gap-1">
          <div className="text-xs text-terminal-muted">
            Showing <span className="text-terminal-green font-semibold">{filteredCount}</span> of{' '}
            <span className="text-terminal-text">{totalMarkets}</span> markets
          </div>
          {filteredCount !== totalMarkets && (
            <button
              onClick={() =>
                onFilterChange({
                  search: '',
                  category: 'All',
                  exchange: 'All',
                  priceRange: { min: 0, max: 100 },
                  showOnlyWithEdge: false,
                })
              }
              className="text-xs text-terminal-red hover:text-terminal-red/80 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};