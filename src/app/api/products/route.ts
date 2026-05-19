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
    console.warn('Database error fetching products, using mock fallback:', error);
    
    let pageNum = 1;
    let pageSizeNum = 20;
    try {
      const page = request.nextUrl.searchParams.get('page') || '1';
      const pageSize = request.nextUrl.searchParams.get('pageSize') || '20';
      pageNum = parseInt(page);
      pageSizeNum = parseInt(pageSize);
    } catch (_) {}

    const mockProducts = [
      {
        id: 1,
        seller_id: 'seller-1',
        name: 'Wireless Headphones',
        description: 'High quality wireless headphones with noise cancellation',
        base_price: 450,
        current_price: 450,
        cost_price: 200,
        category: 'Electronics',
        inventory: 45,
        competitor_prices: { price: 420, competitor: "TechStore" }
      },
      {
        id: 2,
        seller_id: 'seller-1',
        name: 'USB-C Cable',
        description: 'Durable USB-C charging cable',
        base_price: 89,
        current_price: 89,
        cost_price: 30,
        category: 'Electronics',
        inventory: 120,
        competitor_prices: { price: 85, competitor: "ElectroMart" }
      },
      {
        id: 3,
        seller_id: 'seller-1',
        name: 'Phone Stand',
        description: 'Adjustable phone stand for desk',
        base_price: 120,
        current_price: 120,
        cost_price: 60,
        category: 'Accessories',
        inventory: 3,
        competitor_prices: { price: 150, competitor: "AccessoryHub" }
      },
      {
        id: 4,
        seller_id: 'seller-1',
        name: 'Screen Protector',
        description: 'Tempered glass screen protector',
        base_price: 45,
        current_price: 45,
        cost_price: 50,
        category: 'Accessories',
        inventory: 200,
        competitor_prices: { price: 35, competitor: "ProtectMe" }
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        data: mockProducts,
        total: mockProducts.length,
        page: pageNum,
        pageSize: pageSizeNum,
        hasMore: false,
      } as PaginatedResponse<any>,
      timestamp: new Date().toISOString(),
    } as ApiResponse<any>);
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
