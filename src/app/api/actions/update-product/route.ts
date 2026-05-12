import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Update in database using Supabase
    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        description: description || '',
        base_price: basePrice,
        cost_price: costPrice,
        current_price: basePrice,
        inventory,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: data[0],
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
  }
}

