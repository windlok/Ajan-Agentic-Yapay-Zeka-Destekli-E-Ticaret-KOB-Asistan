'use client';

/**
 * Dashboard Page - Main Overview
 * Shows key metrics and agent recommendations
 */

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    // Ürünleri çek
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const result = await res.json();
        if (result.success && result.data?.data) {
          setProducts(result.data.data);
        }
      } catch (e) {
        console.error('Ürünler çekilemedi:', e);
      }
    };

    // Finansal metrikleri çek
    const fetchFinancial = async () => {
      try {
        const res = await fetch('/api/financial');
        const result = await res.json();
        if (result.success && result.data) {
          setDashboardData(result.data);
        }
      } catch (e) {
        console.error('Finansal veriler çekilemedi:', e);
      }
    };

    fetchProducts();
    fetchFinancial();
  }, []);

  // Dinamik hesaplamalar (ürünler SQL'den çekildikten sonra)
  const totalRevenue = products.reduce((sum, p) => {
    const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
    const stock = parseInt(p.inventory) || 0;
    return sum + price * stock;
  }, 0);

  const totalProfit = products.reduce((sum, p) => {
    const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
    const cost = parseFloat(p.cost_price) || 0;
    const stock = parseInt(p.inventory) || 0;
    return sum + (price - cost) * stock;
  }, 0);

  const avgMargin = products.length > 0
    ? products.reduce((sum, p) => {
        const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
        const cost = parseFloat(p.cost_price) || 0;
        return sum + (price > 0 ? ((price - cost) / price) * 100 : 0);
      }, 0) / products.length
    : 0;

  const lowMarginProducts = products.filter(p => {
    const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
    const cost = parseFloat(p.cost_price) || 0;
    return price > 0 && ((price - cost) / price) * 100 < 15;
  });

  const lowStockProducts = products.filter(p => (parseInt(p.inventory) || 0) < 5);

  const overPricedProducts = products.filter(p => {
    const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
    const competitors = p.competitor_prices || {};
    const compPrices = Object.values(competitors).map(Number).filter(v => v > 0);
    if (compPrices.length === 0) return false;
    const avgComp = compPrices.reduce((a: number, b: number) => a + b, 0) / compPrices.length;
    return price > avgComp * 1.2;
  });

  // Modal göster (alert yerine)
  const showModal = (title: string, content: string, type: 'success' | 'error' = 'success') => {
    setModalTitle(title);
    setModalContent(content);
    setModalType(type);
    setModalOpen(true);
  };

  const handleRiskAction = async (actionType: string) => {
    setLoading(true);
    try {
      let response;
      if (actionType === 'margin') {
        response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'OPTIMIZE_PRICE' }),
        });
      } else if (actionType === 'stock') {
        response = await fetch('/api/actions/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: 3,
            productName: 'Phone Stand',
            currentStock: 3,
            recommendedQuantity: 50,
          }),
        });
      } else {
        response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'ANALYZE_MARKET' }),
        });
      }
      const data = await response!.json();
      let message = data.response?.analysis || data.analysis || 'İşlem tamamlandı';
      
      if (actionType === 'stock') {
        message = `📦 ${data.quantity} adet ${data.product} siparişi oluşturuldu.\nSipariş Kodu: ${data.orderId}\n\n🤖 AI Değerlendirmesi:\n${data.geminiRecommendation?.analysis || data.geminiRecommendation || 'Değerlendirme alınamadı.'}`;
      }

      showModal('✅ İşlem Başarılı', message, 'success');
    } catch (error) {
      showModal('❌ Hata', String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Modal Overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'fadeIn 0.25s ease-out' }}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 ${modalType === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{modalTitle}</h3>
                <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
              </div>
            </div>
            {/* Modal Body */}
            <div className="px-6 py-5 max-h-96 overflow-y-auto">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{modalContent}</p>
            </div>
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ana Pano</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Gerçek zamanlı satış ve finansal metrikleri izleyin</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="metric-box">
          <div className="metric-label">Toplam Gelir</div>
          <div className="metric-value">
            {products.length > 0 ? `₺${totalRevenue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` : 'Yükleniyor...'}
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">↑ Stok × Satış Fiyatı</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Toplam Kar</div>
          <div className="metric-value">
            {products.length > 0 ? `₺${totalProfit.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` : 'Yükleniyor...'}
          </div>
          <p className={`text-sm mt-2 ${totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {totalProfit >= 0 ? '↑ Pozitif getiri' : '↓ Zarar durumu'}
          </p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Kar Marjı</div>
          <div className="metric-value">
            {products.length > 0 ? `%${avgMargin.toFixed(1)}` : 'Yükleniyor...'}
          </div>
          <p className={`text-sm mt-2 ${avgMargin >= 20 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
            {avgMargin >= 20 ? 'Ortalamanın üstü' : 'Dikkat: Düşük marj'}
          </p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Aktif Ürün</div>
          <div className="metric-value">
            {products.length > 0 ? products.length : 'Yükleniyor...'}
          </div>
          <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
            {products.length > 0 ? `${lowMarginProducts.length} ürün risk altında` : '...'}
          </p>
        </div>
      </div>

      {/* Agent Status and Recommendations */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Agent Actions */}
        <div className="card bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="card-header text-adaptive font-bold text-lg mb-4">🤖 Son Agent Eylemleri</div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-emerald-950/20 rounded-xl border border-green-200 dark:border-emerald-800/40">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-green-950 dark:text-green-300">Fiyat Optimizasyonu</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">3 ürünün fiyatı otomatik güncellendi</p>
                </div>
                <span className="status-badge status-success">BAŞARILI</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">3 dakika önce</p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800/40">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-blue-950 dark:text-blue-300">Rakip Analizi</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Pazarda 5 yeni rakip tespit edildi</p>
                </div>
                <span className="status-badge status-info">BİLGİ</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">15 dakika önce</p>
            </div>

            <div className="p-4 bg-amber-50/70 dark:bg-amber-950/25 rounded-xl border border-amber-200 dark:border-amber-900/30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-amber-950 dark:text-amber-300">Açıklama İyileştirmesi</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">1 ürün açıklaması optimize edildi</p>
                </div>
                <span className="status-badge status-warning">UYARI</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">1 saat önce</p>
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="card bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="card-header text-adaptive font-bold text-lg mb-4">⚠️ Risk Uyarıları</div>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800/40">
              <p className="font-bold text-red-950 dark:text-red-300">Düşük Kar Marjı Ürünler</p>
              <p className="text-sm text-gray-750 dark:text-gray-300 mt-1">
                {products.length > 0 ? `${lowMarginProducts.length} ürün %15 altında marjla satılıyor` : 'Veri bekleniyor'}
              </p>
              <button onClick={() => handleRiskAction('margin')} disabled={loading} className="mt-3 text-sm font-bold text-red-650 dark:text-red-400 hover:text-red-750 dark:hover:text-red-300 disabled:opacity-50 transition-colors">
                {loading ? '⏳ İşleniyor...' : 'Ayrıntıları Gör →'}
              </button>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800/40">
              <p className="font-bold text-orange-950 dark:text-orange-300">Stok Riski</p>
              <p className="text-sm text-gray-750 dark:text-gray-300 mt-1">
                {products.length > 0 ? `${lowStockProducts.length} ürün stokta 5 birimden az` : 'Veri bekleniyor'}
              </p>
              <button onClick={() => handleRiskAction('stock')} disabled={loading} className="mt-3 text-sm font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 disabled:opacity-50 transition-colors">
                {loading ? '⏳ İşleniyor...' : 'Yönet →'}
              </button>
            </div>

            <div className="p-4 bg-amber-50/70 dark:bg-amber-950/25 rounded-xl border border-amber-200 dark:border-amber-900/30">
              <p className="font-bold text-amber-950 dark:text-amber-300">Fiyat Anomalileri</p>
              <p className="text-sm text-gray-750 dark:text-gray-300 mt-1">
                {products.length > 0 ? `${overPricedProducts.length} ürün rakiplerden %20+ pahalı` : 'Veri bekleniyor'}
              </p>
              <button onClick={() => handleRiskAction('price')} disabled={loading} className="mt-3 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 disabled:opacity-50 transition-colors">
                {loading ? '⏳ İşleniyor...' : 'Öner →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Configuration */}
      <div className="card">
        <div className="card-header">⚙️ Agent Yapılandırması</div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Min. Kar Marjı</p>
            <input
              type="number"
              defaultValue={15}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">%15 tavsiye edilir</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Max Fiyat Değişimi</p>
            <input
              type="number"
              defaultValue={30}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">% olarak</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Güncelleme Sıklığı</p>
            <select defaultValue="Günlük" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors">
              <option>Saatlik</option>
              <option>Günlük</option>
              <option>Haftalık</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 dark:bg-slate-700 dark:border-slate-600 rounded focus:ring-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Otomatik Optimizasyon Etkin</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 dark:bg-slate-700 dark:border-slate-600 rounded focus:ring-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Bildirimler Etkin</span>
          </label>
        </div>

        <button className="btn-primary mt-6">Ayarları Kaydet</button>
      </div>

      {/* Inline CSS for modal animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
