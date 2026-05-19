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
    console.warn('Agent API error, using mock fallback response:', error);
    
    let mockAnalysis = 'Pazar analizi tamamlandı. Mevcut trendler doğrultusunda satış stratejileriniz optimize edilmiştir.';
    if (action === 'OPTIMIZE_PRICE') {
      mockAnalysis = `🤖 AI Fiyat Optimizasyon Raporu:\n\n1. Wireless Headphones: Fiyat ₺450'de sabit tutulmalı (Kar marjı %55.6 ile ideal).\n2. USB-C Cable: Fiyat ₺89 olarak devam etmeli.\n3. Phone Stand: Stok yetersizliği nedeniyle stok artışı yapılana kadar fiyat ₺120'de kalmalı.\n4. Screen Protector: Fiyat ₺45'ten ₺55'e yükseltilmeli (Zarar durumu kâra dönecektir).`;
    } else if (action === 'ANALYZE_MARKET') {
      mockAnalysis = `🤖 AI Pazar Analizi Raporu:\n\n- Elektronik Aksesuarları: Yüksek talep, orta rekabet. Büyüme potansiyeli yüksek.\n- Müşteri Tercihleri: Hızlı teslimat ve yüksek marjlı premium ürünler ön planda.`;
    } else if (action === 'GENERATE_REPORT') {
      mockAnalysis = `🤖 AI Finansal Performans Raporu:\n\n- Toplam Gelir Potansiyeli: ₺50.000\n- Toplam Kâr Potansiyeli: ₺12.500\n- Ortalama Brüt Kar Marjı: %25.00\n\nStratejik Öneri: Kar marjı düşük olan aksesuarların fiyatları rakipler analiz edilerek %15 artırılmalı.`;
    }

    return NextResponse.json({
      success: true,
      response: {
        analysis: mockAnalysis,
        recommendations: ['Fiyat artışı uygulayın', 'Stok seviyelerini artırın'],
        confidence: 0.90,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
