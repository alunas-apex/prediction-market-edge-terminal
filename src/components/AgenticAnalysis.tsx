"use client";

import { useState } from "react";
import {
  Brain,
  Search,
  Globe,
  BarChart3,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  Link2,
  Zap,
} from "lucide-react";
import type { AIModel, SearchTool } from "@/types";
import { MOCK_ALERTS, DEFAULT_CONNECTION_STATUS } from "@/lib/constants";
import AnalysisOutput from "./AnalysisOutput";
import EdgeSignal from "./EdgeSignal";

// Types for AI Analysis
interface AgentStatus {
  agent: string;
  status: "idle" | "running" | "completed" | "error";
  progress: number;
  message: string;
}

interface KeyFactor {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  weight: number;
}

interface AnalysisResult {
  id: string;
  marketUrl: string;
  marketQuestion: string;
  marketPrice: number;
  aiEstimate: number;
  edge: number;
  edgePercentage: number;
  bullCase: string;
  bearCase: string;
  keyFactors: KeyFactor[];
  confidenceScore: number;
  recommendedAction: "BUY YES" | "BUY NO" | "NO TRADE";
  timestamp: Date;
  processingTime: number;
}

// Mock data for the AI Analysis
const mockAgentStatuses: AgentStatus[] = [
  {
    agent: "DataCollector",
    status: "completed",
    progress: 100,
    message: "Market data and news collected",
  },
  {
    agent: "SentimentAnalyzer",
    status: "completed",
    progress: 100,
    message: "Social sentiment analyzed",
  },
  {
    agent: "FundamentalAnalyzer",
    status: "running",
    progress: 67,
    message: "Analyzing underlying factors...",
  },
  {
    agent: "EdgeDetector",
    status: "idle",
    progress: 0,
    message: "Waiting for analysis completion",
  },
];

const mockAnalysisResults: AnalysisResult[] = [
  {
    id: "1",
    marketUrl: "https://manifold.markets/WillBTCbeabove100kby2025",
    marketQuestion: "Will BTC be above $100k by end of 2025?",
    marketPrice: 0.42,
    aiEstimate: 0.65,
    edge: 0.23,
    edgePercentage: 54.8,
    bullCase:
      "BlackRock Bitcoin ETF approval drives institutional adoption. BTC halving reduces supply. Historical cycle patterns suggest new all-time high. Macro tailwinds from Fed rate cuts.",
    bearCase:
      "Regulatory crackdown on crypto exchanges. Economic recession fears override BTC narrative. Technical resistance at $75k triggers selling. Liquidity crisis ripples through market.",
    keyFactors: [
      { factor: "BlackRock ETF inflows exceeded $500M weekly", impact: "positive", weight: 0.25 },
      { factor: "Bitcoin halving completed in April 2024", impact: "positive", weight: 0.2 },
      { factor: "Global M2 money supply increasing", impact: "positive", weight: 0.15 },
      { factor: "SEC regulatory uncertainty remains", impact: "negative", weight: -0.15 },
      { factor: "Technical resistance at $75k level", impact: "negative", weight: -0.1 },
      { factor: "On-chain whale accumulation signals", impact: "neutral", weight: 0.15 },
    ],
    confidenceScore: 0.78,
    recommendedAction: "BUY YES",
    timestamp: new Date("2025-05-09T02:45:00"),
    processingTime: 12400,
  },
  {
    id: "2",
    marketUrl: "https://poly.market/WillAIMakeScientificDiscovery",
    marketQuestion: "Will AI make a major scientific discovery by 2026?",
    marketPrice: 0.35,
    aiEstimate: 0.58,
    edge: 0.23,
    edgePercentage: 65.7,
    bullCase:
      "AlphaFold 3 demonstrates AI drug discovery potential. IBM and Google racing to apply LLMs to materials science. Climate fusion breakthroughs likely require AI guidance. Nobel Prize committee considering AI contributions.",
    bearCase:
      "Current LLMs lack true reasoning for novel discoveries. Scientific method requires human intuition. Data limitations in many fields. Reproducibility crisis extends to AI findings.",
    keyFactors: [
      { factor: "AlphaFold 3 protein structure predictions", impact: "positive", weight: 0.3 },
      { factor: "Google DeepMind materials discovery", impact: "positive", weight: 0.2 },
      { factor: "GPT-5 reasoning limitations", impact: "negative", weight: -0.15 },
      { factor: "Academic AI skepticism", impact: "negative", weight: -0.1 },
      { factor: "Increased R&D AI funding worldwide", impact: "positive", weight: 0.2 },
      { factor: "Historical AI hype cycle failures", impact: "neutral", weight: -0.05 },
    ],
    confidenceScore: 0.72,
    recommendedAction: "BUY YES",
    timestamp: new Date("2025-05-09T02:30:00"),
    processingTime: 15200,
  },
  {
    id: "3",
    marketUrl: "https://manifold.markets/WillSpaceXStarshiplanded",
    marketQuestion: "Will SpaceX Starship land humans on Mars by 2030?",
    marketPrice: 0.18,
    aiEstimate: 0.12,
    edge: -0.06,
    edgePercentage: -33.3,
    bullCase:
      "SpaceX rapid iteration approach proving effective. NASA committed to Artemis lunar missions. Starship testing cadence accelerating. Reusable rocket economics game-changing.",
    bearCase:
      "Mars mission requires untested life support. Radiation shielding unsolved. Political funding uncertainty. Orbital refueling technology unproven. 5-year timeline extremely aggressive.",
    keyFactors: [
      { factor: "NASA Artemis program delays", impact: "negative", weight: -0.2 },
      { factor: "SpaceX Starship flight rate increasing", impact: "positive", weight: 0.15 },
      { factor: "Life support systems unproven", impact: "negative", weight: -0.25 },
      { factor: "Federal budget allocation uncertain", impact: "negative", weight: -0.15 },
      { factor: "China Mars program timeline aligns", impact: "neutral", weight: 0.1 },
      { factor: "Musk history of ambitious deadlines", impact: "negative", weight: -0.15 },
    ],
    confidenceScore: 0.85,
    recommendedAction: "BUY NO",
    timestamp: new Date("2025-05-09T02:15:00"),
    processingTime: 11800,
  },
];

const mockProcessingSteps = [
  "Scraping market data...",
  "Searching news sources...",
  "Analyzing social sentiment...",
  "Evaluating fundamental factors...",
  "Calculating edge probability...",
  "Generating recommendation...",
];


interface ToolOption {
  id: SearchTool;
  name: string;
  icon: typeof Search;
  description: string;
}

const toolOptions: ToolOption[] = [
  {
    id: "x-search",
    name: "X Search",
    icon: Search,
    description: "Search Twitter/X for real-time sentiment",
  },
  {
    id: "web-search",
    name: "Web Search",
    icon: Globe,
    description: "Search the web for news and data",
  },
  {
    id: "polyfactual",
    name: "PolyFactual",
    icon: Brain,
    description: "Multi-source factual verification",
  },
];

const modelOptions: { id: AIModel; name: string; description: string }[] = [
  { id: "grok", name: "Grok", description: "Real-time data analysis" },
  { id: "gpt", name: "GPT-4", description: "Advanced reasoning" },
];

export default function AgenticAnalysis() {
  const [marketUrl, setMarketUrl] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModel>("grok");
  const [selectedTools, setSelectedTools] = useState<SearchTool[]>(["x-search", "web-search"]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>(mockAgentStatuses);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showToolDropdown, setShowToolDropdown] = useState(false);

  const toggleTool = (toolId: SearchTool) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  };

  const startAnalysis = () => {
    if (!marketUrl.trim()) return;

    setIsAnalyzing(true);
    setShowResults(false);
    setAnalysisResults([]);
    setCurrentStep(0);
    setAgentStatuses(
      mockAgentStatuses.map((agent) => ({ ...agent, status: "idle", progress: 0 }))
    );

    // Simulate agent progress
    const agentNames = ["DataCollector", "SentimentAnalyzer", "FundamentalAnalyzer", "EdgeDetector"];
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      setCurrentStep(stepIndex);

      setAgentStatuses((prev) =>
        prev.map((agent, idx) => {
          if (idx < stepIndex) {
            return { ...agent, status: "completed", progress: 100 };
          } else if (idx === stepIndex) {
            return {
              ...agent,
              status: "running",
              progress: Math.random() * 60 + 20,
              message: mockProcessingSteps[stepIndex] || "Processing...",
            };
          } else {
            return { ...agent, status: "idle", progress: 0 };
          }
        })
      );

      if (stepIndex >= agentNames.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setAgentStatuses((prev) =>
            prev.map((agent) => ({ ...agent, status: "completed", progress: 100 }))
          );
          setAnalysisResults(mockAnalysisResults);
          setShowResults(true);
        }, 500);
      }
    }, 1500);
  };


  const getStatusIcon = (status: AgentStatus["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-accent-green" />;
      case "running":
        return <Loader2 className="w-4 h-4 text-accent-cyan animate-spin" />;
      case "error":
        return <XCircle className="w-4 h-4 text-accent-red" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: AgentStatus["status"]) => {
    switch (status) {
      case "completed":
        return "text-accent-green";
      case "running":
        return "text-accent-cyan";
      case "error":
        return "text-accent-red";
      default:
        return "text-gray-500";
    }
  };

  const highConfidenceEdges = analysisResults.filter(
    (r) => r.confidenceScore >= 0.75 && Math.abs(r.edge) >= 0.15
  );

  return (
    <div className="space-y-6">
      {/* Input Panel */}
      <div className="bg-terminal-surface border border-terminal-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-accent-cyan" />
          <h2 className="text-lg font-semibold text-gray-200">Agentic Market Analysis</h2>
        </div>

        {/* Market URL Input */}
        <div className="mb-5">
          <label className="block text-gray-500 text-sm mb-2">
            <Link2 className="w-4 h-4 inline-block mr-1" />
            Market URL
          </label>
          <div className="relative">
            <input
              type="text"
              value={marketUrl}
              onChange={(e) => setMarketUrl(e.target.value)}
              placeholder="https://manifold.markets/WillBTCbeabove100kby2025"
              className="w-full bg-terminal-bg border border-terminal-border rounded px-4 py-3 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors"
            />
            {marketUrl && (
              <button
                onClick={() => setMarketUrl("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-200"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Model and Tools Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* AI Model Selector */}
          <div>
            <label className="block text-gray-500 text-sm mb-2">AI Model</label>
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-4 py-3 text-left flex items-center justify-between hover:border-accent-cyan transition-colors"
              >
                <span className="text-gray-200">
                  {modelOptions.find((m) => m.id === selectedModel)?.name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    showModelDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showModelDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-terminal-surface border border-terminal-border rounded shadow-lg z-10">
                  {modelOptions.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setShowModelDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-terminal-hover transition-colors ${
                        selectedModel === model.id ? "text-accent-cyan" : "text-gray-200"
                      }`}
                    >
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-gray-500">{model.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tool Selector */}
          <div>
            <label className="block text-gray-500 text-sm mb-2">Search Tools</label>
            <div className="relative">
              <button
                onClick={() => setShowToolDropdown(!showToolDropdown)}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-4 py-3 text-left flex items-center justify-between hover:border-accent-cyan transition-colors"
              >
                <div className="flex gap-2">
                  {selectedTools.map((toolId) => {
                    const tool = toolOptions.find((t) => t.id === toolId);
                    const Icon = tool?.icon || Search;
                    return <Icon key={toolId} className="w-4 h-4 text-accent-cyan" />;
                  })}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    showToolDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showToolDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-terminal-surface border border-terminal-border rounded shadow-lg z-10">
                  {toolOptions.map((tool) => {
                    const Icon = tool.icon;
                    const isSelected = selectedTools.includes(tool.id);
                    return (
                      <button
                        key={tool.id}
                        onClick={() => toggleTool(tool.id)}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-terminal-hover transition-colors"
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            isSelected ? "bg-accent-cyan border-accent-cyan" : "border-terminal-border"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-terminal-bg" />}
                        </div>
                        <Icon className="w-4 h-4 text-accent-cyan" />
                        <div>
                          <div className="text-gray-200 font-medium">{tool.name}</div>
                          <div className="text-xs text-gray-500">{tool.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={startAnalysis}
          disabled={!marketUrl.trim() || isAnalyzing}
          className={`w-full py-3 rounded font-semibold flex items-center justify-center gap-2 transition-all ${
            !marketUrl.trim() || isAnalyzing
              ? "bg-terminal-border text-gray-500 cursor-not-allowed"
              : "bg-accent-cyan text-terminal-bg hover:bg-accent-cyan/90 hover:shadow-lg hover:shadow-accent-cyan/20"
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Running Multi-Agent Analysis...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Run Agentic Analysis
            </>
          )}
        </button>
      </div>

      {/* Agent Status Panel */}
      {isAnalyzing && (
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-accent-cyan animate-pulse" />
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
              Agent Status
            </h3>
            <span className="ml-auto text-xs text-gray-500">Step {currentStep} of 4</span>
          </div>

          {/* Processing Steps */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-accent-cyan">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm animate-pulse">
                {mockProcessingSteps[currentStep] || mockProcessingSteps[0]}
              </span>
            </div>
          </div>

          {/* Agent Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {agentStatuses.map((agent) => (
              <div
                key={agent.agent}
                className={`bg-terminal-bg border rounded p-3 transition-all ${
                  agent.status === "running"
                    ? "border-accent-cyan shadow-[0_0_10px_rgba(0,212,255,0.2)]"
                    : agent.status === "completed"
                    ? "border-accent-green/50"
                    : "border-terminal-border"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(agent.status)}
                  <span className={`text-xs font-medium uppercase ${getStatusColor(agent.status)}`}>
                    {agent.agent}
                  </span>
                </div>
                <div className="w-full bg-terminal-border rounded-full h-1.5 mb-2">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      agent.status === "completed"
                        ? "bg-accent-green"
                        : agent.status === "running"
                        ? "bg-accent-cyan"
                        : "bg-gray-500"
                    }`}
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 truncate">{agent.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edge Signals */}
      {highConfidenceEdges.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent-green" />
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
              High-Confidence Edge Signals
            </h3>
            <span className="ml-auto px-2 py-0.5 bg-accent-green/20 text-accent-green text-xs rounded">
              {highConfidenceEdges.length} Active
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {highConfidenceEdges.map((edge) => (
              <EdgeSignal key={edge.id} result={edge} />
            ))}
          </div>
        </div>
      )}

      {/* Analysis Output */}
      {showResults && <AnalysisOutput results={analysisResults} />}
    </div>
  );
}