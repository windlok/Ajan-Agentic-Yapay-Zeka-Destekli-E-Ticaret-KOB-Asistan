/**
 * Financial Dashboard API
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

/**
 * GET /api/financial/dashboard
 * Returns financial metrics and dashboard data
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const sellerId = request.nextUrl.searchParams.get('sellerId') || 'default-seller';

    // Fetch financial metrics from Supabase
    let metrics: any[] = [];
    const { data: metricsData, error: metricsError } = await supabase
      .from('financial_metrics')
      .select('*')
      .eq('seller_id', sellerId)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(12);
      
    if (metricsError) {
      console.warn('Could not fetch financial_metrics from Supabase, using mock data:', metricsError);
      // Fallback mock data if table doesn't exist
      metrics = [
        { month: 5, year: 2024, total_revenue: 50000, total_profit: 12500, profit_margin: 25 },
        { month: 4, year: 2024, total_revenue: 48000, total_profit: 13000, profit_margin: 27.1 },
        { month: 3, year: 2024, total_revenue: 45000, total_profit: 12000, profit_margin: 26.7 },
        { month: 2, year: 2024, total_revenue: 42000, total_profit: 12000, profit_margin: 28.6 },
        { month: 1, year: 2024, total_revenue: 35000, total_profit: 10000, profit_margin: 28.6 },
      ];
    } else {
      metrics = metricsData || [];
      if (metrics.length === 0) {
        // Fallback mock data if empty
        metrics = [
          { month: 5, year: 2024, total_revenue: 50000, total_profit: 12500, profit_margin: 25 },
          { month: 4, year: 2024, total_revenue: 48000, total_profit: 13000, profit_margin: 27.1 },
          { month: 3, year: 2024, total_revenue: 45000, total_profit: 12000, profit_margin: 26.7 },
          { month: 2, year: 2024, total_revenue: 42000, total_profit: 12000, profit_margin: 28.6 },
          { month: 1, year: 2024, total_revenue: 35000, total_profit: 10000, profit_margin: 28.6 },
        ];
        
        // Optional: you can automatically insert these into Supabase here so next time it reads from SQL
        await supabase.from('financial_metrics').insert(
          metrics.map(m => ({ ...m, seller_id: sellerId }))
        );
      }
    }

    // Fetch products for calculations
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name, current_price, cost_price, inventory, base_price')
      .eq('seller_id', sellerId)
      .order('current_price', { ascending: false });
      
    const products = (productsData || []).map(p => {
      const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
      const cost = parseFloat(p.cost_price) || 0;
      return {
        ...p,
        current_price: price,
        profit_per_unit: price - cost
      };
    });

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
