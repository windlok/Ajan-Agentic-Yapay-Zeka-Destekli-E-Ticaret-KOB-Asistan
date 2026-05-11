/**
 * Product Management API Routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { ApiResponse, PaginatedResponse } from '@/types';

/**
 * GET /api/products
 * Fetch all products for a seller with pagination
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const page = request.nextUrl.searchParams.get('page') || '1';
    const pageSize = request.nextUrl.searchParams.get('pageSize') || '20';
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    // Fetch from Supabase
    const { rows } = await sql`
      SELECT * FROM products
      ORDER BY updated_at DESC
      LIMIT ${parseInt(pageSize)} OFFSET ${offset}
    `;

    const { rows: countRows } = await sql`
      SELECT COUNT(*) as total FROM products
    `;

    const total = parseInt(countRows[0].total);
    const hasMore = offset + parseInt(pageSize) < total;

    return NextResponse.json({
      success: true,
      data: {
        data: rows,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        hasMore,
      } as PaginatedResponse<any>,
      timestamp: new Date().toISOString(),
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
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
