import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@vercel/postgres';

/**
 * PUT /api/actions/update-product
 * Update product details
 */
export async function PUT(req: NextRequest) {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
  });

  try {
    await client.connect();
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

    // Update in database using direct query with params
    const result = await client.query(`
      UPDATE products 
      SET 
        name = $1,
        description = $2,
        base_price = $3,
        cost_price = $4,
        current_price = $5,
        inventory = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [name, description || '', basePrice, costPrice, basePrice, inventory, productId]);

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
    console.error('Update Error:', error);
    return NextResponse.json(
      { error: 'Ürün güncelleme başarısız', details: String(error) },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

