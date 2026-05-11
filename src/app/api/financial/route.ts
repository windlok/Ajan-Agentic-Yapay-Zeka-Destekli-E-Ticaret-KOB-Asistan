/**
 * Financial Dashboard API
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { ApiResponse } from '@/types';

/**
 * GET /api/financial/dashboard
 * Returns financial metrics and dashboard data
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const sellerId = request.nextUrl.searchParams.get('sellerId') || 'default-seller';

    // Fetch financial metrics from Supabase
    const { rows: metrics } = await sql`
      SELECT * FROM financial_metrics
      WHERE seller_id = ${sellerId}
      ORDER BY year DESC, month DESC
      LIMIT 12
    `;

    // Fetch products for calculations
    const { rows: products } = await sql`
      SELECT 
        id, name, current_price, cost_price, inventory,
        (current_price - cost_price) as profit_per_unit
      FROM products
      WHERE seller_id = ${sellerId}
      ORDER BY current_price DESC
    `;

    // Calculate summary metrics
    const totalRevenue = metrics.reduce((sum, m) => sum + (m.total_revenue || 0), 0);
    const totalProfit = metrics.reduce((sum, m) => sum + (m.total_profit || 0), 0);
    const avgMargin = products.length > 0 
      ? (products.reduce((sum, p) => sum + ((p.profit_per_unit / p.current_price) * 100 || 0), 0) / products.length)
      : 0;

    const dashboardData = {
      totalRevenue,
      totalProfit,
      averageMargin: Math.round(avgMargin),
      productCount: products.length,
      riskProducts: products.filter(p => ((p.profit_per_unit / p.current_price) * 100 || 0) < 15),
      opportunityProducts: products.filter(p => ((p.profit_per_unit / p.current_price) * 100 || 0) > 30),
      metrics,
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
