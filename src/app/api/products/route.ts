/**
 * Product Management API Routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; 
import type { ApiResponse, PaginatedResponse } from '@/types';

/**
 * GET /api/products
 * Fetch all products for a seller with pagination
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const page = request.nextUrl.searchParams.get('page') || '1';
    const pageSize = request.nextUrl.searchParams.get('pageSize') || '20';
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const from = (pageNum - 1) * pageSizeNum;
    const to = from + pageSizeNum - 1;

    console.log('Fetching products using Supabase Client (HTTP)...');
    
    // Fetch from Supabase using HTTP client
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true }) // updated_at yerine id ile sıralayalım
      .range(from, to);

    if (error) throw error;

    const total = count || 0;
    const hasMore = to < total - 1;

    return NextResponse.json({
      success: true,
      data: {
        data: data || [],
        total,
        page: pageNum,
        pageSize: pageSizeNum,
        hasMore,
      } as PaginatedResponse<any>,
      timestamp: new Date().toISOString(),
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.basePrice || !body.costPrice) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, basePrice, costPrice',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { rows } = await sql`
      INSERT INTO products (
        seller_id, name, description, base_price, current_price, cost_price,
        category, inventory, competitor_prices
      ) VALUES (
        ${body.sellerId || 'default-seller'},
        ${body.name},
        ${body.description || ''},
        ${body.basePrice},
        ${body.currentPrice || body.basePrice},
        ${body.costPrice},
        ${body.category || 'Uncategorized'},
        ${body.inventory || 0},
        ${JSON.stringify(body.competitorPrices || {})}
      )
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        data: rows[0],
        message: 'Product created successfully',
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
