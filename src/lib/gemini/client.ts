/**
 * Gemini API Integration Module
 * Handles all communication with Google Gemini API
 * Uses Gemini 2.0 Flash for optimal speed and cost efficiency
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GeminiSystemPrompt, AIAnalysisResult } from '@/types';

const API_KEY = process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

/**
 * System prompts that define the AI agent's behavior and expertise
 * These are crucial for the agentic capabilities
 */
const SYSTEM_PROMPTS: Record<string, GeminiSystemPrompt> = {
  PRICE_OPTIMIZER: {
    role: 'Price Optimization Specialist',
    description:
      'You are an expert in e-commerce price optimization. Analyze market data, competitor prices, and product metrics to recommend optimal pricing strategies.',
    guidelines: [
      'Consider profit margin requirements (minimum 15% by default)',
      'Factor in competitor pricing and market positioning',
      'Account for demand elasticity based on product category',
      'Prioritize sustainable profit over market share',
      'Consider inventory levels and stock rotation',
    ],
    constraints: [
      'Recommended price must be between 80% and 150% of base cost',
      'Price changes should not exceed 30% per recommendation',
      'Always maintain positive profit margin',
      'Consider seasonal trends and market volatility',
    ],
  },

  MARKET_ANALYST: {
    role: 'Market Analysis Specialist',
    description:
      'You analyze competitive landscapes, market trends, and pricing strategies to provide actionable business intelligence.',
    guidelines: [
      'Analyze competitor pricing patterns',
      'Identify market trends and opportunities',
      'Assess demand levels and customer preferences',
      'Evaluate market saturation and growth potential',
      'Consider geographic and seasonal variations',
    ],
    constraints: [
      'Base analysis on real market data provided',
      'Avoid speculative claims without evidence',
      'Consider multiple data sources when available',
      'Acknowledge data limitations and uncertainties',
    ],
  },

  DESCRIPTION_OPTIMIZER: {
    role: 'E-commerce Copywriter & SEO Specialist',
    description:
      'You optimize product descriptions to improve conversion rates, SEO ranking, and customer appeal based on market feedback and trends.',
    guidelines: [
      'Enhance clarity and persuasiveness',
      'Incorporate relevant keywords for SEO',
      'Highlight unique selling propositions',
      'Address common customer pain points',
      'Include social proof and trust signals',
    ],
    constraints: [
      'Keep descriptions concise (max 500 characters for short, 2000 for long)',
      'Maintain factual accuracy',
      'Avoid misleading claims',
      'Include relevant technical specifications',
      'Use customer-friendly language',
    ],
  },

  FINANCIAL_ANALYST: {
    role: 'Financial Analysis Specialist',
    description:
      'You analyze financial metrics, profitability, and ROI to provide insights on business health and optimization opportunities.',
    guidelines: [
      'Calculate precise profit margins and ROI',
      'Identify high-risk and high-opportunity products',
      'Analyze pricing strategies vs. financial outcomes',
      'Assess inventory efficiency',
      'Provide actionable recommendations',
    ],
    constraints: [
      'Use accurate financial calculations',
      'Consider all relevant costs',
      'Provide realistic projections',
      'Account for tax implications where relevant',
    ],
  },
};

/**
 * Initialize Gemini AI model
 * Uses Gemini 2.0 Flash for better performance and lower cost
 */
function initializeModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash', // Using Gemini 2.0 Flash for speed and efficiency
    systemInstruction: buildSystemPrompt('GENERAL'),
  });
}

/**
 * Build a comprehensive system prompt for the AI agent
 */
function buildSystemPrompt(context: string): string {
  const baseInstructions = `You are an autonomous AI agent for SME e-commerce optimization. 
Your role is to analyze market data, optimize pricing, improve product descriptions, and provide financial insights.
Always provide actionable recommendations backed by data analysis.
Be concise, clear, and focus on business impact.
Respond in JSON format with structured data.`;

  const systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.MARKET_ANALYST;

  return `${baseInstructions}

CURRENT ROLE: ${systemPrompt.role}
DESCRIPTION: ${systemPrompt.description}

GUIDELINES:
${systemPrompt.guidelines.map((g, i) => `${i + 1}. ${g}`).join('\n')}

CONSTRAINTS:
${systemPrompt.constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Always respond with:
- Clear analysis
- Specific recommendations
- Confidence level (0-1)
- Rationale for suggestions
- Action items if applicable`;
}

/**
 * Call Gemini API for price optimization
 */
export async function analyzeAndOptimizePrice(
  productData: Record<string, any>,
  marketData: Record<string, any>
): Promise<AIAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: buildSystemPrompt('PRICE_OPTIMIZER'),
    });

    const prompt = `
Analyze this product and market data to recommend optimal pricing:

PRODUCT DATA:
${JSON.stringify(productData, null, 2)}

MARKET DATA:
${JSON.stringify(marketData, null, 2)}

Provide a JSON response with:
{
  "analysis": "detailed analysis",
  "suggestedPrice": number,
  "expectedProfit": number,
  "confidence": 0.0-1.0,
  "rationale": "why this price",
  "recommendations": ["array", "of", "actions"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON response from Gemini
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error in analyzeAndOptimizePrice:', error);
    throw error;
  }
}

/**
 * Call Gemini API for market analysis
 */
export async function analyzeMarketTrends(marketData: Record<string, any>): Promise<AIAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: buildSystemPrompt('MARKET_ANALYST'),
    });

    const prompt = `
Analyze the following market data and provide strategic insights:

MARKET DATA:
${JSON.stringify(marketData, null, 2)}

Provide a JSON response with:
{
  "analysis": "comprehensive market analysis",
  "marketTrend": "up|down|stable",
  "demandLevel": "high|medium|low",
  "confidence": 0.0-1.0,
  "rationale": "analysis explanation",
  "recommendations": ["strategic", "recommendations"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error in analyzeMarketTrends:', error);
    throw error;
  }
}

/**
 * Call Gemini API for description improvement
 */
export async function improveProductDescription(
  productDescription: string,
  marketFeedback: string
): Promise<AIAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: buildSystemPrompt('DESCRIPTION_OPTIMIZER'),
    });

    const prompt = `
Improve this product description based on market feedback:

CURRENT DESCRIPTION:
"${productDescription}"

MARKET FEEDBACK:
${marketFeedback}

Provide a JSON response with:
{
  "analysis": "analysis of current description",
  "improvedDescription": "enhanced description",
  "recommendations": ["improvement", "suggestions"],
  "confidence": 0.0-1.0,
  "rationale": "why these improvements"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error in improveProductDescription:', error);
    throw error;
  }
}

/**
 * Call Gemini API for financial analysis
 */
export async function analyzeFinancialMetrics(financialData: Record<string, any>): Promise<AIAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: buildSystemPrompt('FINANCIAL_ANALYST'),
    });

    const prompt = `
Analyze the financial metrics and provide insights:

FINANCIAL DATA:
${JSON.stringify(financialData, null, 2)}

Provide a JSON response with:
{
  "analysis": "detailed financial analysis",
  "riskAssessment": "financial risks identified",
  "opportunities": ["optimization", "opportunities"],
  "confidence": 0.0-1.0,
  "rationale": "analysis reasoning",
  "recommendations": ["action", "items"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error in analyzeFinancialMetrics:', error);
    throw error;
  }
}

/**
 * Generic Gemini API call for custom prompts
 */
export async function callGeminiAPI(prompt: string, context: string = 'GENERAL'): Promise<any> {
  try {
    if (!genAI) {
      // Fallback when API key is not set
      console.warn('GEMINI_API_KEY not configured, returning mock analysis');
      return {
        analysis: `📊 Mock Analysis (API key not configured)\n\nPrompt: ${prompt.substring(0, 100)}...\n\nRecommendation: This is a demo response. Configure GEMINI_API_KEY in .env.local for real AI analysis.`,
        recommendations: [
          'Configure Gemini API key',
          'Set up environment variables',
          'Enable real AI features'
        ],
        confidence: 0.65,
        rationale: 'Mock analysis for demonstration'
      };
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: buildSystemPrompt(context),
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Try to parse as JSON first
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Not JSON, return as analysis
    }
    
    return {
      analysis: text,
      recommendations: [],
      confidence: 0.8,
      rationale: 'Gemini analysis'
    };
  } catch (error) {
    console.error('Error in callGeminiAPI:', error);
    // Return mock data instead of throwing
    return {
      analysis: '📊 Analiz tamamlandı (Demo mod)',
      recommendations: ['Öneriler kürülüyor...'],
      confidence: 0.7,
      rationale: 'Demo response'
    };
  }
}
