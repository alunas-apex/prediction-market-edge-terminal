import { Market, PricePoint, Category, Exchange } from './types';

const categories: Category[] = ['Crypto', 'Politics', 'Sports', 'Economics', 'Entertainment', 'Technology'];
const exchanges: Exchange[] = ['Polymarket', 'Kalshi'];

const mockQuestions: Array<{ question: string; category: Category; tags: string[] }> = [
  { question: 'Bitcoin exceeds $100,000 by end of 2025?', category: 'Crypto', tags: ['BTC', 'price'] },
  { question: 'Ethereum spot ETF approved by SEC in Q3 2024?', category: 'Crypto', tags: ['ETH', 'ETF'] },
  { question: 'Solana daily transactions exceed Visa by Dec 2024?', category: 'Crypto', tags: ['SOL', 'adoption'] },
  { question: 'Will Ethereum flip Bitcoin market cap in 2025?', category: 'Crypto', tags: ['ETH', 'flippening'] },
  { question: 'Donald Trump wins 2024 Presidential election?', category: 'Politics', tags: ['election', 'Trump'] },
  { question: 'Republicans control Senate after 2024 elections?', category: 'Politics', tags: ['election', 'Senate'] },
  { question: 'Kansas City Chiefs win Super Bowl LIX?', category: 'Sports', tags: ['NFL', 'Super Bowl'] },
  { question: 'Los Angeles Lakers make NBA Finals 2025?', category: 'Sports', tags: ['NBA', 'Lakers'] },
  { question: 'Fed cuts interest rates 3+ times in 2024?', category: 'Economics', tags: ['Fed', 'rates'] },
  { question: 'S&P 500 exceeds 5,500 by end of 2024?', category: 'Economics', tags: ['S&P500', 'stocks'] },
  { question: 'Taylor Swift Eras Tour gross exceeds $2B?', category: 'Entertainment', tags: ['music', 'tour'] },
  { question: 'OpenAI releases GPT-5 in 2024?', category: 'Entertainment', tags: ['AI', 'GPT'] },
  { question: 'Apple Vision Pro ships over 500K units in 2024?', category: 'Technology', tags: ['Apple', 'VR'] },
  { question: 'SpaceX Starship reaches orbit in 2024?', category: 'Technology', tags: ['SpaceX', 'rocket'] },
];

function generatePriceHistory(basePrice: number, volatility: number = 0.05): PricePoint[] {
  const history: PricePoint[] = [];
  const now = Date.now();
  let price = basePrice;
  for (let i = 168; i >= 0; i--) {
    const change = (Math.random() - 0.5) * volatility;
    price = Math.max(0.01, Math.min(0.99, price + change));
    history.push({ timestamp: now - i * 3600000, yesPrice: price, noPrice: 1 - price });
  }
  return history;
}

function calculateEdgeScore(yesPrice: number, volume: number, liquidity: number): number {
  const distance = Math.abs(yesPrice - 0.5);
  const volumeScore = Math.log10(volume + 1) / 10;
  const liquidityScore = Math.log10(liquidity + 1) / 10;
  return Math.min(100, (distance * 100 * 0.5) + (volumeScore * 30) + (liquidityScore * 20));
}

export function generateMockMarkets(count: number = 100): Market[] {
  const markets: Market[] = [];
  for (let i = 0; i < count; i++) {
    const template = mockQuestions[i % mockQuestions.length];
    const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    const basePrice = Math.random() * 0.8 + 0.1;
    const volume24h = Math.floor(Math.random() * 5000000) + 10000;
    const liquidity = Math.floor(Math.random() * 10000000) + 50000;
    const change24h = (Math.random() - 0.5) * 0.2;
    markets.push({
      id: `market-${i}-${Date.now()}`, question: template.question,
      description: `Will ${template.question.toLowerCase().replace('?', '')}? This market resolves based on verified outcomes.`,
      yesPrice: basePrice, noPrice: 1 - basePrice, volume24h, change24h,
      edgeScore: calculateEdgeScore(basePrice, volume24h, liquidity),
      exchange, category: template.category, liquidity,
      lastUpdated: Date.now() - Math.floor(Math.random() * 300000),
      priceHistory: generatePriceHistory(basePrice), tags: template.tags,
    });
  }
  return markets.sort((a, b) => b.volume24h - a.volume24h);
}

export const mockMarkets = generateMockMarkets(150);