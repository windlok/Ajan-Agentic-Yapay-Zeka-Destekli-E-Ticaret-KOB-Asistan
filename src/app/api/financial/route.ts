/**
 * Financial Dashboard API
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

/**
 * GET /api/financial/dashboard
 * Returns financial metrics and dashboard data
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // TODO: Fetch real data from database and calculate metrics
    const dashboardData = {
      totalRevenue: 50000,
      totalProfit: 12500,
      totalCost: 37500,
      averageMargin: 25,
      profitMargin: 0.25,
      riskProducts: ['prod-3', 'prod-4'],
      opportunityProducts: ['prod-1', 'prod-2'],
      trends: [
        { date: '2026-05-01', revenue: 5000, profit: 1250, unitsSold: 50 },
        { date: '2026-05-02', revenue: 5500, profit: 1375, unitsSold: 55 },
        { date: '2026-05-03', revenue: 5200, profit: 1300, unitsSold: 52 },
      ],
      topProducts: [
        { id: 'prod-1', name: 'Product 1', revenue: 15000, profit: 4500 },
        { id: 'prod-2', name: 'Product 2', revenue: 12000, profit: 2400 },
        { id: 'prod-3', name: 'Product 3', revenue: 10000, profit: 1000 },
      ],
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString(),
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error fetching financial dashboard:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch financial data',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

/**
 * POST /api/financial/analyze
 * Trigger financial analysis via agent
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Delegate to agent for analysis
    const agentResponse = await fetch('http://localhost:3000/api/agent/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-seller-id': body.sellerId || 'default-seller',
      },
      body: JSON.stringify({
        action: 'GENERATE_REPORT',
        data: body.financialData,
      }),
    });

    const agentResult = await agentResponse.json();

    return NextResponse.json({
      success: agentResult.success,
      data: agentResult.data,
      timestamp: new Date().toISOString(),
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error analyzing financial data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze financial data',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
