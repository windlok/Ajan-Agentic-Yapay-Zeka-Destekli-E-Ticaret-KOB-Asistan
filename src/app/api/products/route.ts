/**
 * Product Management API Routes
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, PaginatedResponse } from '@/types';

/**
 * GET /api/products
 * Fetch all products for a seller with pagination
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const page = request.nextUrl.searchParams.get('page') || '1';
    const pageSize = request.nextUrl.searchParams.get('pageSize') || '20';

    // TODO: Fetch from database
    // For now, return mock data
    const mockProducts = [
      {
        id: 'prod-1',
        name: 'Sample Product 1',
        basePrice: 100,
        currentPrice: 120,
        costPrice: 50,
        inventory: 45,
        category: 'Electronics',
        description: 'High quality product',
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        data: mockProducts,
        total: 1,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        hasMore: false,
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

    // TODO: Save to database
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...body,
      currentPrice: body.basePrice,
      lastUpdated: new Date(),
      createdAt: new Date(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
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
