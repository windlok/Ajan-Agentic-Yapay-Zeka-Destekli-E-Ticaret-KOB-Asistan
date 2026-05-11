/**
 * POST /api/agent/analyze
 * Agent receives product data and market conditions
 * Returns autonomous analysis and recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AgentRequest, ApiResponse } from '@/types';
import { createAgent } from '@/lib/agents/agent';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AgentRequest = await request.json();

    // Validate request
    if (!body.action) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing action',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Get seller ID from header or context
    const sellerId = request.headers.get('x-seller-id') || 'default-seller';

    // Create agent with default preferences
    // In production, load actual preferences from database
    const defaultPreferences = {
      minMarginPercentage: 15,
      maxPriceChange: 30,
      autoOptimize: true,
      updateFrequency: 'daily' as const,
      notificationsEnabled: true,
    };

    const agent = createAgent(sellerId, defaultPreferences);

    // Execute agent action
    const result = await agent.execute(body);

    // Return agent response
    return NextResponse.json(
      {
        success: result.success,
        data: {
          action: result.action,
          result: result.result,
          recommendation: result.recommendation,
          confidence: result.confidence,
          appliedChanges: result.appliedChanges,
          timestamp: result.timestamp,
        },
        message: result.success ? 'Analysis completed' : result.error,
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>,
      { status: result.success ? 200 : 400 }
    );
  } catch (error) {
    console.error('Agent API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

/**
 * GET /api/agent/analyze
 * Health check and documentation
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    message: 'AI Commerce Agent API is active',
    endpoints: [
      {
        method: 'POST',
        path: '/api/agent/analyze',
        description: 'Execute agent analysis (price optimization, market analysis, etc.)',
        actions: [
          'OPTIMIZE_PRICE',
          'ANALYZE_MARKET',
          'IMPROVE_DESCRIPTION',
          'ASSESS_COMPETITOR',
          'GENERATE_REPORT',
        ],
      },
    ],
    timestamp: new Date().toISOString(),
  });
}
