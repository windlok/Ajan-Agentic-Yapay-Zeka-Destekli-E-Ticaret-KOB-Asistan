import { NextRequest, NextResponse } from 'next/server';
import { callGeminiAPI } from '@/lib/gemini/client';
import { sql } from '@vercel/postgres';

/**
 * POST /api/actions/improve-descriptions
 * Improve product descriptions using AI
 */
export async function POST(req: NextRequest) {
  try {
    const { productIds } = await req.json();

    // Fetch products from database
    const productsResult = await sql`SELECT id, name, description FROM products WHERE id = ANY($1)`, [productIds];
    const products = productsResult.rows;

    const improvements: any[] = [];

    for (const product of products) {
      // Get Gemini improvement
      const result = await callGeminiAPI(
        `Ürün: ${product.name}\nMevcut Açıklama: ${product.description}\n\nBu açıklamayı SEO dostu, satış odaklı hale getir. Yeni açıklama yaz.`,
        'DESCRIPTION_OPTIMIZER'
      );

      // Update database
      await sql`UPDATE products SET description = $1, updated_at = NOW() WHERE id = $2`, [result.analysis, product.id];

      improvements.push({
        productId: product.id,
        productName: product.name,
        oldDescription: product.description,
        newDescription: result.analysis,
        confidence: result.confidence,
      });
    }

    return NextResponse.json({
      success: true,
      improvedCount: improvements.length,
      improvements,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Açıklama iyileştirmesi başarısız', details: String(error) },
      { status: 500 }
    );
  }
}
