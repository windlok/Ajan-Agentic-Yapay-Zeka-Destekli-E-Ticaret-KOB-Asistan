import { NextRequest, NextResponse } from 'next/server';
import { callGeminiAPI } from '@/lib/gemini/client';

/**
 * POST /api/agent
 * Main agent endpoint for autonomous AI operations
 */
export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    let prompt = '';
    let context = 'MARKET_ANALYST';

    // Build prompt based on action
    if (action === 'OPTIMIZE_PRICE') {
      prompt = `
        Analize sahip ürünler: Wireless Headphones (₺450), USB-C Cable (₺89), Phone Stand (₺120), Screen Protector (₺45).
        
        Bu ürünlerin fiyatlarını rakip fiyatlarına göre optimize et. Her ürün için:
        - Önerilen yeni fiyat
        - Tahmini kar marjı değişimi
        - Haklılama
        
        JSON formatında döndür.
      `;
      context = 'PRICE_OPTIMIZER';
    } else if (action === 'ANALYZE_MARKET') {
      prompt = `
        E-commerce pazarında şu ürün kategorileri vardır: Elektronik Aksesuarları, Bilgisayar Bileşenleri, Cep Telefonu Aksesuarları.
        
        Pazar analizi yap:
        - Pazarın büyüme potansiyeli
        - Rekabet seviyesi
        - Müşteri tercihleri
        - Fırsatlar
        
        JSON formatında döndür.
      `;
      context = 'MARKET_ANALYST';
    } else if (action === 'GENERATE_REPORT') {
      prompt = `
        Finansal veriler:
        - Toplam Gelir: ₺50.000
        - Toplam Kar: ₺12.500
        - Kar Marjı: 25%
        - Ürün Sayısı: 4
        
        Detaylı finansal rapor ve öneriler yap. JSON formatında döndür.
      `;
      context = 'FINANCIAL_ANALYST';
    } else {
      prompt = `Genel ticari tavsiyeleri AI olarak ver. ${action || 'Pazar analizi'} konusunda.`;
    }

    // Call Gemini
    const result = await callGeminiAPI(prompt, context);

    return NextResponse.json({
      success: true,
      response: {
        analysis: typeof result === 'string' ? result : result.analysis,
        recommendations: result.recommendations || [],
        confidence: result.confidence || 0.75,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json(
      { 
        error: 'Agent işlemi başarısız',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
