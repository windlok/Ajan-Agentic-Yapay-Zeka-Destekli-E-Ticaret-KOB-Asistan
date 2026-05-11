/**
 * Core Type Definitions for AI Commerce Agent
 * Defines all TypeScript interfaces and types used across the application
 */

// ============= PRODUCT TYPES =============
export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  costPrice: number;
  category: string;
  inventory: number;
  competitorPrices?: number[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  basePrice?: number;
  costPrice?: number;
  category?: string;
  inventory?: number;
}

// ============= FINANCIAL TYPES =============
export interface FinancialMetrics {
  productId: string;
  profitMargin: number;
  currentProfit: number;
  potentialProfit: number;
  markup: number;
  roi: number;
  breakEvenPrice: number;
}

export interface SalesData {
  productId: string;
  unitsSold: number;
  totalRevenue: number;
  averagePrice: number;
  period: 'daily' | 'weekly' | 'monthly';
}

export interface FinancialDashboard {
  totalRevenue: number;
  totalProfit: number;
  totalCost: number;
  averageMargin: number;
  riskProducts: string[]; // Product IDs with negative margin
  opportunityProducts: string[]; // Product IDs with high margin potential
  trends: DailyTrend[];
}

export interface DailyTrend {
  date: string;
  revenue: number;
  profit: number;
  unitssSold: number;
}

// ============= AGENT TYPES =============
export interface AgentRequest {
  action: AgentAction;
  productId?: string;
  data?: Record<string, any>;
  context?: Record<string, any>;
}

export interface AgentResponse {
  success: boolean;
  action: AgentAction;
  result?: Record<string, any>;
  recommendation?: string;
  confidence: number;
  appliedChanges?: string[];
  error?: string;
  timestamp: Date;
}

export enum AgentAction {
  ANALYZE_MARKET = 'analyze_market',
  OPTIMIZE_PRICE = 'optimize_price',
  IMPROVE_DESCRIPTION = 'improve_description',
  ASSESS_COMPETITOR = 'assess_competitor',
  GENERATE_REPORT = 'generate_report',
}

// ============= GEMINI API TYPES =============
export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiSystemPrompt {
  role: string;
  description: string;
  guidelines: string[];
  constraints: string[];
}

export interface AIAnalysisResult {
  analysis: string;
  recommendations: string[];
  suggestedPrice?: number;
  confidence: number;
  rationale: string;
}

// ============= MARKET ANALYSIS TYPES =============
export interface MarketAnalysis {
  productId: string;
  competitorAverage: number;
  minPrice: number;
  maxPrice: number;
  marketTrend: 'up' | 'down' | 'stable';
  demandLevel: 'high' | 'medium' | 'low';
  optimalPrice: number;
  priceRecommendation: {
    suggestedPrice: number;
    expectedProfit: number;
    marketShare: string;
  };
}

// ============= SELLER/USER TYPES =============
export interface Seller {
  id: string;
  businessName: string;
  email: string;
  phone?: string;
  apiKey: string;
  preferences: SellerPreferences;
  createdAt: Date;
}

export interface SellerPreferences {
  minMarginPercentage: number;
  maxPriceChange: number; // Max percentage change per update
  autoOptimize: boolean;
  updateFrequency: 'hourly' | 'daily' | 'weekly';
  notificationsEnabled: boolean;
}

// ============= API RESPONSE TYPES =============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
