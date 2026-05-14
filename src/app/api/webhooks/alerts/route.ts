/**
 * Webhook Alerts API
 * Stok kritik seviyeye düştüğünde veya marj negatife geçtiğinde otomatik uyarı
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Ürünleri çek
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    const alerts: any[] = [];

    (products || []).forEach((p: any) => {
      const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
      const cost = parseFloat(p.cost_price) || 0;
      const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
      const stock = parseInt(p.inventory) || 0;

      // Negatif marj uyarısı
      if (margin < 0) {
        alerts.push({
          type: 'CRITICAL',
          category: 'NEGATIVE_MARGIN',
          productId: p.id,
          productName: p.name,
          message: `${p.name} zararda satılıyor! Marj: %${margin.toFixed(1)}. Acil fiyat güncellemesi gerekli.`,
          currentPrice: price,
          costPrice: cost,
          margin: margin.toFixed(1),
          suggestedPrice: (cost * 1.2).toFixed(2),
          severity: 'high',
          timestamp: new Date().toISOString(),
        });
      }

      // Düşük marj uyarısı
      if (margin >= 0 && margin < 10) {
        alerts.push({
          type: 'WARNING',
          category: 'LOW_MARGIN',
          productId: p.id,
          productName: p.name,
          message: `${p.name} kâr marjı çok düşük: %${margin.toFixed(1)}. Fiyat artışı önerilir.`,
          currentPrice: price,
          margin: margin.toFixed(1),
          severity: 'medium',
          timestamp: new Date().toISOString(),
        });
      }

      // Kritik stok uyarısı
      if (stock <= 5 && stock > 0) {
        alerts.push({
          type: 'WARNING',
          category: 'LOW_STOCK',
          productId: p.id,
          productName: p.name,
          message: `${p.name} stoku kritik seviyede: ${stock} adet. Acil tedarik gerekli.`,
          currentStock: stock,
          severity: 'high',
          timestamp: new Date().toISOString(),
        });
      }

      // Stok tükenme uyarısı
      if (stock === 0) {
        alerts.push({
          type: 'CRITICAL',
          category: 'OUT_OF_STOCK',
          productId: p.id,
          productName: p.name,
          message: `${p.name} tamamen tükendi! Satış kaybı yaşanıyor.`,
          severity: 'critical',
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Webhook URL varsa gönder (ortam değişkeninden)
    const webhookUrl = process.env.WEBHOOK_ALERT_URL;
    let webhookSent = false;

    if (webhookUrl && alerts.length > 0) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'AI Commerce Agent',
            alertCount: alerts.length,
            alerts: alerts,
            timestamp: new Date().toISOString(),
          }),
        });
        webhookSent = true;
      } catch (webhookError) {
        console.error('Webhook gönderilemedi:', webhookError);
      }
    }

    // E-posta bildirim simülasyonu (log olarak)
    if (alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length > 0) {
      console.log('📧 E-POSTA BİLDİRİM TETİKLENDİ:');
      console.log(`   Konu: ${alerts.length} uyarı tespit edildi`);
      console.log(`   Kritik: ${alerts.filter(a => a.severity === 'critical').length}`);
      console.log(`   Yüksek: ${alerts.filter(a => a.severity === 'high').length}`);
      console.log(`   Orta: ${alerts.filter(a => a.severity === 'medium').length}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        totalAlerts: alerts.length,
        criticalCount: alerts.filter(a => a.type === 'CRITICAL').length,
        warningCount: alerts.filter(a => a.type === 'WARNING').length,
        alerts,
        webhookSent,
        emailTriggered: alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length > 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Alert API hatası:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Manuel alert tetikleme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, productId } = body;

    // Webhook URL varsa gönder
    const webhookUrl = process.env.WEBHOOK_ALERT_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'AI Commerce Agent - Manuel',
          type,
          message,
          productId,
          timestamp: new Date().toISOString(),
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Alert başarıyla tetiklendi',
      webhookSent: !!webhookUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
