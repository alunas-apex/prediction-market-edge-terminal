export type Exchange = 'Polymarket' | 'Kalshi';
export type Category = 'Crypto' | 'Politics' | 'Sports' | 'Economics' | 'Entertainment' | 'Technology';
export interface PricePoint { timestamp: number; yesPrice: number; noPrice: number; }
export interface Market {
  id: string; question: string; description: string; yesPrice: number; noPrice: number;
  volume24h: number; change24h: number; edgeScore: number; exchange: Exchange; category: Category;
  liquidity: number; lastUpdated: number; priceHistory: PricePoint[]; tags: string[];
}
export interface FilterState {
  search: string; category: Category | 'All'; exchange: Exchange | 'All';
  priceRange: { min: number; max: number; }; showOnlyWithEdge: boolean;
}
export interface SortConfig {
  field: 'question' | 'yesPrice' | 'volume24h' | 'edgeScore' | 'change24h'; direction: 'asc' | 'desc';
}