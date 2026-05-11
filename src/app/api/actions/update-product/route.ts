import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * PUT /api/actions/update-product
 * Update product details
 */
export async function PUT(req: NextRequest) {
  try {
    const { productId, name, description, basePrice, costPrice, inventory } = await req.json();

    // Validate required fields
    if (!productId || !name) {
      return NextResponse.json(
        { error: 'Ürün ID ve adı gerekli' },
        { status: 400 }
      );
    }

    // Calculate new margin
    const newMargin = ((basePrice - costPrice) / basePrice * 100).toFixed(2);

    // Update in database
    const result = await sql`
      UPDATE products 
      SET 
        name = $1,
        description = $2,
        base_price = $3,
        cost_price = $4,
        current_price = $3,
        inventory = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [name, description, basePrice, costPrice, inventory, productId];

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: result.rows[0],
      newMargin,
      message: `${name} başarıyla güncellendi`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ürün güncelleme başarısız', details: String(error) },
      { status: 500 }
    );
  }
}
