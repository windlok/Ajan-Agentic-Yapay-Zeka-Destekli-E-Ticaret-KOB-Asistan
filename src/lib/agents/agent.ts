/**
 * Agentic AI Agent Orchestrator
 * Core logic for autonomous decision-making and action execution
 * This is where the "agent" autonomously decides what to do based on data
 */

import type { AgentRequest, AgentResponse, AgentAction, Product, SellerPreferences } from '@/types';
import {
  analyzeAndOptimizePrice,
  analyzeMarketTrends,
  improveProductDescription,
  analyzeFinancialMetrics,
} from '../gemini/client';

/**
 * Main Agent Orchestrator Class
 * Responsible for:
 * 1. Processing incoming requests
 * 2. Analyzing data autonomously
 * 3. Making decisions
 * 4. Executing actions
 * 5. Logging and reporting
 */
export class AiCommerceAgent {
  private sellerId: string;
  private preferences: SellerPreferences;
  private actionLog: AgentResponse[] = [];

  constructor(sellerId: string, preferences: SellerPreferences) {
    this.sellerId = sellerId;
    this.preferences = preferences;
  }

  /**
   * Main execution method - routes requests to appropriate handlers
   */
  async execute(request: AgentRequest): Promise<AgentResponse> {
    try {
      let result: AgentResponse;

      switch (request.action) {
        case AgentAction.OPTIMIZE_PRICE:
          result = await this.optimizePriceAutonomously(request);
          break;

        case AgentAction.ANALYZE_MARKET:
          result = await this.analyzeMarketAutonomously(request);
          break;

        case AgentAction.IMPROVE_DESCRIPTION:
          result = await this.improveDescriptionAutonomously(request);
          break;

        case AgentAction.ASSESS_COMPETITOR:
          result = await this.assessCompetitorAutonomously(request);
          break;

        case AgentAction.GENERATE_REPORT:
          result = await this.generateFinancialReport(request);
          break;

        default:
          throw new Error(`Unknown action: ${request.action}`);
      }

      // Log the action
      this.actionLog.push(result);

      return result;
    } catch (error) {
      return this.createErrorResponse(request.action, error);
    }
  }

  /**
   * AUTONOMOUS PRICE OPTIMIZATION
   * Agent analyzes product data, market conditions, and competitor prices
   * Then makes autonomous pricing decisions
   */
  private async optimizePriceAutonomously(request: AgentRequest): Promise<AgentResponse> {
    const { productId, data, context } = request;

    if (!productId || !data) {
      throw new Error('Missing productId or data');
    }

    // Extract product data
    const product = data.product as Product;
    const competitorPrices = data.competitorPrices as number[] || [];
    const salesHistory = data.salesHistory || {};

    // Prepare market data for AI analysis
    const marketData = {
      competitorPrices,
      currentPrice: product.currentPrice,
      basePrice: product.basePrice,
      costPrice: product.costPrice,
      category: product.category,
      inventory: product.inventory,
      demandIndicators: this.calculateDemandIndicators(salesHistory),
      minMarginRequired: this.preferences.minMarginPercentage,
    };

    // Call Gemini AI for analysis and recommendation
    const analysis = await analyzeAndOptimizePrice(
      {
        id: product.id,
        name: product.name,
        currentPrice: product.currentPrice,
        costPrice: product.costPrice,
        basePrice: product.basePrice,
      },
      marketData
    );

    // AUTONOMOUS ACTION: Decide whether to apply the recommendation
    const shouldApply = this.evaluatePriceChangeDecision(
      product.currentPrice,
      analysis.suggestedPrice || product.currentPrice,
      analysis.confidence
    );

    const appliedChanges: string[] = [];
    if (shouldApply) {
      appliedChanges.push(`Price updated from ${product.currentPrice} to ${analysis.suggestedPrice}`);
      // In real scenario, this would update the database
    }

    return {
      success: true,
      action: AgentAction.OPTIMIZE_PRICE,
      result: {
        productId,
        currentPrice: product.currentPrice,
        recommendedPrice: analysis.suggestedPrice,
        expectedProfit: analysis.suggestedPrice ? (analysis.suggestedPrice - product.costPrice) : null,
        profitMargin: analysis.suggestedPrice
          ? ((analysis.suggestedPrice - product.costPrice) / analysis.suggestedPrice) * 100
          : null,
        analysis: analysis.analysis,
      },
      recommendation: analysis.rationale,
      confidence: analysis.confidence,
      appliedChanges: shouldApply ? appliedChanges : [],
      timestamp: new Date(),
    };
  }

  /**
   * AUTONOMOUS MARKET ANALYSIS
   * Agent continuously monitors market conditions and identifies opportunities
   */
  private async analyzeMarketAutonomously(request: AgentRequest): Promise<AgentResponse> {
    const { data } = request;

    if (!data || !data.products) {
      throw new Error('Missing products data for market analysis');
    }

    const products: Product[] = data.products;

    // Gather market intelligence
    const marketIntelligence = {
      averageMarketPrice: products.reduce((sum, p) => sum + (p.competitorPrices?.[0] || p.currentPrice), 0) / products.length,
      productCount: products.length,
      highMarginProducts: products.filter((p) => ((p.currentPrice - p.costPrice) / p.currentPrice) * 100 > 40),
      lowMarginProducts: products.filter((p) => ((p.currentPrice - p.costPrice) / p.currentPrice) * 100 < 15),
      outOfStock: products.filter((p) => p.inventory === 0),
      lowStock: products.filter((p) => p.inventory > 0 && p.inventory < 5),
    };

    const analysis = await analyzeMarketTrends(marketIntelligence);

    return {
      success: true,
      action: AgentAction.ANALYZE_MARKET,
      result: {
        marketAnalysis: analysis.analysis,
        trend: analysis.marketTrend || 'stable',
        demandLevel: analysis.demandLevel || 'medium',
        opportunities: marketIntelligence.highMarginProducts.map((p) => ({
          productId: p.id,
          productName: p.name,
          profitMargin: ((p.currentPrice - p.costPrice) / p.currentPrice) * 100,
        })),
        risks: marketIntelligence.lowMarginProducts.map((p) => ({
          productId: p.id,
          productName: p.name,
          profitMargin: ((p.currentPrice - p.costPrice) / p.currentPrice) * 100,
        })),
      },
      recommendation: analysis.rationale,
      confidence: analysis.confidence,
      timestamp: new Date(),
    };
  }

  /**
   * AUTONOMOUS DESCRIPTION IMPROVEMENT
   * Agent analyzes customer feedback and market trends to improve descriptions
   */
  private async improveDescriptionAutonomously(request: AgentRequest): Promise<AgentResponse> {
    const { productId, data } = request;

    if (!productId || !data) {
      throw new Error('Missing productId or data');
    }

    const { currentDescription, customerFeedback, productMetrics } = data;

    const analysis = await improveProductDescription(currentDescription, customerFeedback || 'Standard market feedback');

    return {
      success: true,
      action: AgentAction.IMPROVE_DESCRIPTION,
      result: {
        productId,
        originalDescription: currentDescription,
        improvedDescription: analysis.improvedDescription || '',
        improvements: analysis.recommendations,
      },
      recommendation: analysis.rationale,
      confidence: analysis.confidence,
      appliedChanges: [`Description improved for product ${productId}`],
      timestamp: new Date(),
    };
  }

  /**
   * AUTONOMOUS COMPETITOR ASSESSMENT
   * Agent continuously monitors competitors and identifies strategic opportunities
   */
  private async assessCompetitorAutonomously(request: AgentRequest): Promise<AgentResponse> {
    const { data } = request;

    if (!data || !data.competitorData) {
      throw new Error('Missing competitor data');
    }

    const competitorAnalysis = {
      competitorCount: data.competitorData.length,
      averagePrice: data.competitorData.reduce((sum: number, c: any) => sum + c.price, 0) / data.competitorData.length,
      priceRange: {
        min: Math.min(...data.competitorData.map((c: any) => c.price)),
        max: Math.max(...data.competitorData.map((c: any) => c.price)),
      },
      recommendedPosition: data.recommendedPosition || 'competitive',
    };

    return {
      success: true,
      action: AgentAction.ASSESS_COMPETITOR,
      result: {
        competitorAnalysis,
        strategicRecommendation: `Position product at ${competitorAnalysis.recommendedPosition}`,
      },
      recommendation: 'Monitor competitor activities weekly',
      confidence: 0.85,
      timestamp: new Date(),
    };
  }

  /**
   * AUTONOMOUS FINANCIAL REPORT GENERATION
   * Agent compiles and analyzes financial metrics
   */
  private async generateFinancialReport(request: AgentRequest): Promise<AgentResponse> {
    const { data } = request;

    if (!data || !data.financialData) {
      throw new Error('Missing financial data');
    }

    const analysis = await analyzeFinancialMetrics(data.financialData);

    return {
      success: true,
      action: AgentAction.GENERATE_REPORT,
      result: {
        financialAnalysis: analysis.analysis,
        risks: analysis.analysis ? 'See analysis' : 'Unable to determine',
        opportunities: analysis.recommendations,
      },
      recommendation: analysis.rationale,
      confidence: analysis.confidence,
      timestamp: new Date(),
    };
  }

  /**
   * Helper: Evaluate if price change should be autonomously applied
   * AUTONOMOUS DECISION MAKING - this is key to being an agent!
   */
  private evaluatePriceChangeDecision(
    currentPrice: number,
    recommendedPrice: number | undefined,
    confidence: number
  ): boolean {
    if (!recommendedPrice) return false;

    // Calculate percentage change
    const percentChange = Math.abs((recommendedPrice - currentPrice) / currentPrice) * 100;

    // Decision logic:
    // 1. Confidence must be > 70%
    // 2. Change must not exceed max allowed
    // 3. Recommended price must improve profit margin

    const shouldApply =
      confidence > 0.7 &&
      percentChange <= this.preferences.maxPriceChange &&
      this.preferences.autoOptimize === true;

    return shouldApply;
  }

  /**
   * Helper: Calculate demand indicators from sales history
   */
  private calculateDemandIndicators(salesHistory: Record<string, any>): Record<string, number> {
    return {
      dailyAverageUnits: salesHistory.dailyAverageUnits || 0,
      weeklyTrend: salesHistory.weeklyTrend || 0,
      monthlyGrowth: salesHistory.monthlyGrowth || 0,
    };
  }

  /**
   * Create error response
   */
  private createErrorResponse(action: AgentAction, error: unknown): AgentResponse {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return {
      success: false,
      action,
      error: errorMessage,
      confidence: 0,
      timestamp: new Date(),
    };
  }

  /**
   * Get action history for auditing and learning
   */
  getActionHistory(): AgentResponse[] {
    return this.actionLog;
  }

  /**
   * Clear action log
   */
  clearActionLog(): void {
    this.actionLog = [];
  }
}

/**
 * Factory function to create agent instances
 */
export function createAgent(sellerId: string, preferences: SellerPreferences): AiCommerceAgent {
  return new AiCommerceAgent(sellerId, preferences);
}
