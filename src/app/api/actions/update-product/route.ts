import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * PUT /api/actions/update-product
 * Update product details in database
 */
export async function PUT(req: NextRequest) {
  try {
    const { productId, name, description, basePrice, costPrice, inventory } = await req.json();

    console.log('🔄 Update request received:', { productId, name, basePrice, costPrice, inventory });

    // Validate required fields
    if (!productId || !name) {
      return NextResponse.json(
        { error: 'Ürün ID ve adı gerekli' },
        { status: 400 }
      );
    }

    // Calculate new margin
    const newMargin = ((basePrice - costPrice) / basePrice * 100).toFixed(2);

    console.log('📝 Attempting to update product:', productId);

    // Update in database
    const result = await sql`
      UPDATE products 
      SET 
        name = ${name},
        description = ${description},
        base_price = ${basePrice},
        cost_price = ${costPrice},
        current_price = ${basePrice},
        inventory = ${inventory},
        updated_at = NOW()
      WHERE id = ${productId}
      RETURNING *
    `;

    console.log('📊 Update result rows:', result.rows.length);

    if (result.rows.length === 0) {
      console.warn('⚠️ Product not found:', productId);
      return NextResponse.json(
        { 
          error: `Ürün bulunamadı (ID: ${productId})`,
          productId,
          details: 'Veritabanında bu ID ile ürün yok. Mock verisi mi kullanıyorsunuz?'
        },
        { status: 404 }
      );
    }

    console.log('✅ Product updated successfully:', productId);

    return NextResponse.json({
      success: true,
      product: result.rows[0],
      newMargin,
      message: `${name} başarıyla güncellendi`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json(
      { 
        error: 'Ürün güncelleme başarısız', 
        details: String(error),
        message: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}
