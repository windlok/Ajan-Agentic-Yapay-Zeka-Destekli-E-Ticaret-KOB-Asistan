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
    return NextResponse.json(
      { error: 'Sipariş işlemi başarısız', details: String(error) },
      { status: 500 }
    );
  }
}
