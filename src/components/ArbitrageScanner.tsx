import React, { useState } from 'react';
import { Search, Cpu, Loader2, Link2, Zap } from 'lucide-react';

interface ArbitrageScannerProps {
  onScan: (url: string, model: string) => void;
  isScanning: boolean;
}

const AI_MODELS = [
  { id: 'gpt-4', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'claude-3', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
];

export const ArbitrageScanner: React.FC<ArbitrageScannerProps> = ({ onScan, isScanning }) => {
  const [marketUrl, setMarketUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [urlError, setUrlError] = useState('');

  const validateUrl = (url: string): boolean => {
    if (!url) {
      setUrlError('Please enter a market URL');
      return false;
    }
    const validPatterns = [
      'polymarket.com',
      'kalshi.com',
      'kalshi.mx',
      'polymarket.xyz',
    ];
    const isValid = validPatterns.some(pattern => url.includes(pattern));
    if (!isValid) {
      setUrlError('URL must be from Polymarket or Kalshi');
      return false;
    }
    setUrlError('');
    return true;
  };

  const handleScan = () => {
    if (validateUrl(marketUrl)) {
      onScan(marketUrl, selectedModel);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMarketUrl(e.target.value);
    if (urlError) setUrlError('');
  };

  return (
    <div className="terminal-panel p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center">
          <Search className="w-5 h-5 text-terminal-green" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-terminal-green">ARBITRAGE SCANNER</h2>
          <p className="text-xs text-terminal-border">Cross-platform opportunity detection</p>
        </div>
      </div>

      {/* Market URL Input */}
      <div className="mb-6">
        <label className="block text-xs text-terminal-border mb-2 uppercase tracking-wider">
          Market URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link2 className="w-4 h-4 text-terminal-muted" />
          </div>
          <input
            type="text"
            value={marketUrl}
            onChange={handleUrlChange}
            placeholder="https://polymarket.com/c/will-sp-500-reach"
            className={`
              w-full bg-terminal-black border rounded-lg pl-10 pr-4 py-3
              text-sm text-terminal-text placeholder-terminal-muted
              focus:outline-none focus:border-terminal-green/50 focus:ring-1 focus:ring-terminal-green/20
              transition-all duration-300
              ${urlError ? 'border-terminal-red' : 'border-terminal-border'}
            `}
          />
        </div>
        {urlError && (
          <p className="mt-2 text-xs text-terminal-red flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-terminal-red"></span>
            {urlError}
          </p>
        )}
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setMarketUrl('https://polymarket.com/c/will-sp-500-reach-5500-by-eoy')}
            className="text-xs text-terminal-blue hover:text-terminal-blue/80 transition-colors"
          >
            [Polymarket Demo]
          </button>
          <button
            onClick={() => setMarketUrl('https://kalshi.com/events/PRES-2024-WIN')}
            className="text-xs text-terminal-blue hover:text-terminal-blue/80 transition-colors"
          >
            [Kalshi Demo]
          </button>
        </div>
      </div>

      {/* AI Model Selector */}
      <div className="mb-6">
        <label className="block text-xs text-terminal-border mb-2 uppercase tracking-wider">
          AI Analysis Model
        </label>
        <div className="grid grid-cols-3 gap-2">
          {AI_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`
                relative p-3 rounded-lg border transition-all duration-300
                ${selectedModel === model.id
                  ? 'bg-terminal-green/10 border-terminal-green/50 glow-green'
                  : 'bg-terminal-black border-terminal-border hover:border-terminal-muted'
                }
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <Cpu className={`w-4 h-4 ${selectedModel === model.id ? 'text-terminal-green' : 'text-terminal-muted'}`} />
                <span className={`text-xs font-medium ${selectedModel === model.id ? 'text-terminal-green' : 'text-terminal-text'}`}>
                  {model.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-terminal-muted">{model.provider}</span>
              </div>
              {selectedModel === model.id && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scan Button */}
      <button
        onClick={handleScan}
        disabled={isScanning || !marketUrl}
        className={`
          w-full py-4 rounded-lg font-semibold text-sm uppercase tracking-wider
          transition-all duration-300 flex items-center justify-center gap-3
          ${isScanning
            ? 'bg-terminal-green/20 text-terminal-green cursor-not-allowed'
            : 'bg-terminal-green text-terminal-black hover:shadow-lg hover:shadow-terminal-green/30'
          }
        `}
      >
        {isScanning ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Scanning Markets...</span>
            <div className="flex gap-1 ml-2">
              <span className="w-2 h-2 rounded-full bg-terminal-green animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-terminal-green animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-terminal-green animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            <span>Scan for Arbitrage</span>
          </>
        )}
      </button>

      {/* Status Indicators */}
      {isScanning && (
        <div className="mt-4 p-3 rounded-lg bg-terminal-black/50 border border-terminal-border">
          <div className="flex items-center gap-2 text-xs text-terminal-muted">
            <div className="w-2 h-2 rounded-full bg-terminal-yellow animate-pulse" />
            <span>Connecting to Polymarket API...</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-terminal-muted mt-1">
            <div className="w-2 h-2 rounded-full bg-terminal-yellow animate-pulse" />
            <span>Connecting to Kalshi API...</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-terminal-muted mt-1">
            <div className="w-2 h-2 rounded-full bg-terminal-muted" />
            <span>Running arbitrage analysis...</span>
          </div>
        </div>
      )}
    </div>
  );
};