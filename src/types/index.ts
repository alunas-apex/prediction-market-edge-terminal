// Navigation types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

// Market data types
export interface MarketData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  prediction?: number;
}

export interface PredictionMarket extends MarketData {
  liquidity: number;
  impliedProbability: number;
  lastUpdate: string;
}

// Portfolio types
export interface Position {
  id: string;
  marketId: string;
  marketName: string;
  shares: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

export interface Portfolio {
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  positions: Position[];
}

// Alert types
export interface Alert {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Arbitrage opportunity types
export interface ArbitrageOpportunity {
  id: string;
  marketA: string;
  marketB: string;
  priceDiff: number;
  profitPercent: number;
  expiration: string;
  confidence: number;
}

// AI Analysis types
export interface AIInsight {
  id: string;
  market: string;
  signal: "bullish" | "bearish" | "neutral";
  confidence: number;
  summary: string;
  factors: string[];
  timestamp: string;
}

// Connection status
export interface ConnectionStatus {
  status: "connected" | "connecting" | "disconnected";
  latency: number;
  lastSync: string;
}