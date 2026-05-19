import { NextRequest, NextResponse } from 'next/server';
import { callGeminiAPI } from '@/lib/gemini/client';

/**
 * POST /api/actions/order
 * Handle order placement recommendations
 */
export async function POST(req: NextRequest) {
  try {
    const { productId, productName, currentStock, recommendedQuantity } = await req.json();

    // Get Gemini recommendation
    const prompt = `
      Ürün: ${productName}
      Mevcut Stok: ${currentStock} birim
      Önerilen Sipariş Miktarı: ${recommendedQuantity} birim
      
      Bu sipariş için uygun mu? Eğer uygunsa "APPROVE", değilse "REJECT" + sebep ver.
      Ayrıca tavsiye edilen tedarikçi türünü (ulusal/uluslararası) ve tahmini teslim süresini söyle.
    `;

    const result = await callGeminiAPI(prompt, 'MARKET_ANALYST');
    
    // Simulate order placement
    const orderId = `ORD-${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      orderId,
      product: productName,
      quantity: recommendedQuantity,
      status: 'Sipariş Onaylandı',
      geminiRecommendation: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Gemini API failed in order action, using mock fallback:', error);
    
    // Fallback safe values
    const safeProductName = productName || 'Phone Stand';
    const safeQuantity = recommendedQuantity || 50;
    
    const orderId = `ORD-MOCK-${Date.now()}`;
    return NextResponse.json({
      success: true,
      orderId,
      product: safeProductName,
      quantity: safeQuantity,
      status: 'Sipariş Onaylandı (Demo Modu)',
      geminiRecommendation: {
        analysis: `🤖 AI Analiz Raporu:\n${safeProductName} ürünü için önerilen ${safeQuantity} adetlik sipariş onaylandı. Mevcut stok seviyesi kritik eşiğin altındadır. Hızlı sevkiyat sunan yerel tedarikçiler tercih edilmelidir.\nTahmini teslim süresi: 2 iş günü.`
      },
      timestamp: new Date().toISOString(),
    });
  }
}
