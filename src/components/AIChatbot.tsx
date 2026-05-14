'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Merhaba! 👋 Ben AI Ticaret Asistanınız. Size ürünleriniz, fiyatlar ve finansal durumunuz hakkında yardımcı olabilirim.\n\nÖrnek sorular:\n• "En çok zarar eden ürün hangisi?"\n• "Stokta kaç ürün var?"\n• "Ortalama kâr marjım nedir?"' }
  ]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const result = await res.json();
        if (result.success && result.data?.data) {
          setProducts(result.data.data);
        }
      } catch (e) {
        console.error('Chatbot: Ürünler yüklenemedi', e);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const answerQuestion = (question: string): string => {
    const q = question.toLowerCase().trim();
    
    if (products.length === 0) {
      return '⏳ Ürün verileri henüz yüklenmedi. Lütfen biraz bekleyin ve tekrar sorun.';
    }

    const processed = products.map((p: any) => {
      const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
      const cost = parseFloat(p.cost_price) || 0;
      const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
      const profit = price - cost;
      const stock = parseInt(p.inventory) || 0;
      return { ...p, price, cost, margin, profit, stock, name: p.name };
    });

    // En çok zarar eden
    if (q.includes('zarar') || q.includes('kayıp') || q.includes('kaybet')) {
      const worst = [...processed].sort((a, b) => a.profit - b.profit)[0];
      if (worst.profit < 0) {
        return `🔴 En çok zarar eden ürün: **${worst.name}**\n\nSatış: ₺${worst.price} | Maliyet: ₺${worst.cost}\nBirim Zarar: ₺${Math.abs(worst.profit).toFixed(0)}\nMarj: %${worst.margin.toFixed(1)}\n\n💡 Öneri: Fiyatı en az ₺${(worst.cost * 1.15).toFixed(0)}'e çıkarın.`;
      }
      return '✅ Harika haber! Zarar eden ürününüz yok.';
    }

    // En karlı
    if (q.includes('karlı') || q.includes('en iyi') || q.includes('yıldız') || q.includes('başarılı')) {
      const best = [...processed].sort((a, b) => b.profit - a.profit)[0];
      return `⭐ En karlı ürün: **${best.name}**\n\nSatış: ₺${best.price} | Maliyet: ₺${best.cost}\nBirim Kâr: ₺${best.profit.toFixed(0)}\nMarj: %${best.margin.toFixed(1)}\nStok: ${best.stock} adet\n\n💡 Bu ürünün stokunu artırarak daha fazla gelir elde edebilirsiniz.`;
    }

    // Stok soruları
    if (q.includes('stok') || q.includes('envanter') || q.includes('kaç ürün')) {
      const totalStock = processed.reduce((s, p) => s + p.stock, 0);
      const lowStock = processed.filter(p => p.stock < 10);
      let response = `📦 Toplam stok: ${totalStock} adet (${processed.length} ürün)\n`;
      if (lowStock.length > 0) {
        response += `\n⚠️ Kritik stoklu ürünler:\n`;
        lowStock.forEach(p => {
          response += `• ${p.name}: ${p.stock} adet\n`;
        });
        response += `\n💡 Bu ürünlerde acil tedarik yapılmalı.`;
      } else {
        response += '\n✅ Tüm ürün stokları yeterli seviyede.';
      }
      return response;
    }

    // Marj soruları
    if (q.includes('marj') || q.includes('kâr') || q.includes('kar')) {
      const avgMargin = processed.reduce((s, p) => s + p.margin, 0) / processed.length;
      const totalProfit = processed.reduce((s, p) => s + (p.profit * p.stock), 0);
      let response = `📊 Ortalama kâr marjı: %${avgMargin.toFixed(1)}\n`;
      response += `💰 Toplam kâr potansiyeli: ₺${totalProfit.toLocaleString('tr-TR')}\n\n`;
      response += `Ürün bazlı marjlar:\n`;
      processed.forEach(p => {
        const emoji = p.margin < 0 ? '🔴' : p.margin < 15 ? '🟡' : '🟢';
        response += `${emoji} ${p.name}: %${p.margin.toFixed(1)}\n`;
      });
      return response;
    }

    // Fiyat soruları
    if (q.includes('fiyat') || q.includes('pahalı') || q.includes('ucuz')) {
      let response = '💲 Ürün fiyat listesi:\n\n';
      processed.forEach(p => {
        response += `• ${p.name}: ₺${p.price} (Maliyet: ₺${p.cost})\n`;
      });
      return response;
    }

    // Rakip soruları
    if (q.includes('rakip') || q.includes('rekabet') || q.includes('competitor')) {
      let response = '🏆 Rakip Fiyat Analizi:\n\n';
      processed.forEach(p => {
        const comps = p.competitor_prices || {};
        const compValues = Object.values(comps).map(Number).filter(v => v > 0);
        if (compValues.length > 0) {
          const avg = compValues.reduce((a: number, b: number) => a + b, 0) / compValues.length;
          const diff = ((p.price / avg - 1) * 100).toFixed(0);
          response += `• ${p.name}: Sizin ₺${p.price} vs Rakip ort. ₺${avg.toFixed(0)} (${Number(diff) > 0 ? '+' : ''}${diff}%)\n`;
        } else {
          response += `• ${p.name}: Rakip verisi yok\n`;
        }
      });
      return response;
    }

    // Genel özet
    if (q.includes('özet') || q.includes('durum') || q.includes('genel') || q.includes('nasıl')) {
      const totalRevenue = processed.reduce((s, p) => s + (p.price * p.stock), 0);
      const totalCost = processed.reduce((s, p) => s + (p.cost * p.stock), 0);
      const avgMargin = processed.reduce((s, p) => s + p.margin, 0) / processed.length;
      return `📋 Genel Durum Özeti:\n\n• Toplam Ürün: ${processed.length}\n• Potansiyel Gelir: ₺${totalRevenue.toLocaleString('tr-TR')}\n• Toplam Maliyet: ₺${totalCost.toLocaleString('tr-TR')}\n• Brüt Kâr: ₺${(totalRevenue - totalCost).toLocaleString('tr-TR')}\n• Ort. Marj: %${avgMargin.toFixed(1)}\n\n${avgMargin > 20 ? '✅ İşletmeniz sağlıklı görünüyor.' : '⚠️ Marjlarınız düşük, fiyat optimizasyonu önerilir.'}`;
    }

    // Bilinmeyen soru - Gemini'ye yönlendir
    return `🤔 Bu soruyu anlayamadım. Şu konularda yardımcı olabilirim:\n\n• "En çok zarar eden ürün?"\n• "Stok durumu nasıl?"\n• "Kâr marjım nedir?"\n• "Rakip fiyatları nasıl?"\n• "Genel durum özeti ver"\n• "En karlı ürün hangisi?"`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    // Küçük gecikme ile gerçekçi hissettir
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const answer = answerQuestion(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: answer }]);
    setLoading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center text-2xl"
        title="AI Asistan"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ animation: 'chatSlideUp 0.3s ease-out', height: '500px' }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
              <div>
                <p className="text-white font-bold text-sm">AI Ticaret Asistanı</p>
                <p className="text-white/70 text-xs">Çevrimiçi • SQL veritabanından cevaplar</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="p-4 overflow-y-auto" style={{ height: '370px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md border border-gray-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md border border-gray-200">
                  <span className="text-gray-500 text-sm animate-pulse">Düşünüyorum...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Sorunuzu yazın..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
