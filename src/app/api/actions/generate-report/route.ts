import { NextRequest, NextResponse } from 'next/server';
import { callGeminiAPI } from '@/lib/gemini/client';
import { sql } from '@vercel/postgres';

/**
 * POST /api/actions/generate-report
 * Generate financial report using AI analysis
 */
export async function POST(req: NextRequest) {
  try {
    const { sellerId = 'seller-1', month, year } = await req.json();

    // Fetch financial data
    const productsResult = await sql`SELECT 
      COUNT(*) as total_products,
      SUM(CAST(current_price * inventory AS FLOAT)) as total_inventory_value,
      AVG(CAST((current_price - cost_price) * 100 / current_price AS FLOAT)) as avg_margin
      FROM products WHERE seller_id = $1`, [sellerId];

    const financialResult = await sql`SELECT 
      total_revenue, 
      total_profit, 
      profit_margin 
      FROM financial_metrics 
      WHERE seller_id = $1 AND month = $2 AND year = $3`, [sellerId, month || new Date().getMonth() + 1, year || new Date().getFullYear()];

    const products = productsResult.rows[0];
    const financial = financialResult.rows[0];

    // Generate report with Gemini
    const reportPrompt = `
      KOBİ Finansal Raporu:
      - Toplam Ürün: ${products.total_products}
      - Toplam Gelir: ₺${financial?.total_revenue || 0}
      - Toplam Kar: ₺${financial?.total_profit || 0}
      - Ort. Kar Marjı: ${financial?.profit_margin || 0}%
      
      Bu verilere göre detaylı finansal analiz yap. Güçlü ve zayıf yönleri belirt. Öneriler sun.
    `;

    const result = await callGeminiAPI(reportPrompt, 'FINANCIAL_ANALYST');

    return NextResponse.json({
      success: true,
      reportId: `RPT-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      period: `${month}/${year}`,
      analysis: result.analysis,
      recommendations: result.recommendations,
      confidence: result.confidence,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Rapor oluşturma başarısız', details: String(error) },
      { status: 500 }
    );
  }
}
