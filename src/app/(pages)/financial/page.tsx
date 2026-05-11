'use client';

/**
 * Financial Status Page
 * Detailed financial analytics and AI-driven insights
 */

import { useState } from 'react';

export default function FinancialPage() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePricingOptimization = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'OPTIMIZE_PRICE' }),
      });
      const data = await response.json();
      alert(`✅ Fiyatlandırma Önerisi Uygulandı!\n\n${data.response?.analysis || 'Fiyatlar güncellendi'}`);
    } catch (error) {
      alert(`❌ Hata: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPlacement = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/actions/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 3, // Phone Stand
          productName: 'Phone Stand',
          currentStock: 3,
          recommendedQuantity: 50,
        }),
      });
      const data = await response.json();
      alert(`✅ Sipariş Onaylandı!\n\nSipariş ID: ${data.orderId}\nMiktar: ${data.quantity} birim\nDurum: ${data.status}`);
    } catch (error) {
      alert(`❌ Hata: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProfitMaximization = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ASSESS_COMPETITOR' }),
      });
      const data = await response.json();
      alert(`📊 Kar Maksimizasyonu Analizi\n\n${data.response?.analysis || 'Rakip analizi tamamlandı'}`);
    } catch (error) {
      alert(`❌ Hata: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRiskAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'GENERATE_REPORT' }),
      });
      const data = await response.json();
      alert(`📋 Keskinlik Analizi\n\n${data.response?.analysis || 'Risk analizi tamamlandı'}`);
    } catch (error) {
      alert(`❌ Hata: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finansal Durum</h1>
        <p className="text-gray-600 mt-2">Gerçek zamanlı kâr/zarar analizi ve AI önerileri</p>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <div className="metric-box">
          <div className="metric-label">Toplam Gelir</div>
          <div className="metric-value">₺50.000</div>
          <p className="text-xs text-blue-600 mt-1">Bu ay</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Toplam Maliyet</div>
          <div className="metric-value">₺37.500</div>
          <p className="text-xs text-blue-600 mt-1">Ürün maliyeti</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Brüt Kar</div>
          <div className="metric-value">₺12.500</div>
          <p className="text-xs text-green-600 mt-1">↑ 8% artış</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Net Kar Marjı</div>
          <div className="metric-value">25%</div>
          <p className="text-xs text-blue-600 mt-1">Sektör ort. 20%</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">ROI</div>
          <div className="metric-value">250%</div>
          <p className="text-xs text-green-600 mt-1">Yüksek verimlilik</p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="card">
        <div className="card-header">📈 Haftalık Gelir Trendi</div>

        <div className="h-64 flex items-end justify-around p-6 bg-gray-50 rounded-lg">
          {[5, 5.5, 5.2, 5.8, 6.2, 6.5, 7.1].map((value, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg"
                style={{ height: `${value * 30}px` }}
              />
              <span className="text-xs text-gray-600">Gün {i + 1}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-around text-sm">
          <div>
            <p className="text-gray-600">Haftalık Toplam</p>
            <p className="text-lg font-bold text-blue-600">₺42.900</p>
          </div>
          <div>
            <p className="text-gray-600">Günlük Ortalama</p>
            <p className="text-lg font-bold text-blue-600">₺6.129</p>
          </div>
          <div>
            <p className="text-gray-600">Trend</p>
            <p className="text-lg font-bold text-green-600">↑ +8.5%</p>
          </div>
        </div>
      </div>

      {/* Product Profitability Analysis */}
      <div className="grid grid-cols-2 gap-6">
        {/* Most Profitable */}
        <div className="card">
          <div className="card-header">💎 En Karlı Ürünler</div>

          <div className="space-y-3">
            {[
              { name: 'Wireless Headphones', profit: 4500, margin: 44.4 },
              { name: 'USB-C Cable', profit: 2800, margin: 66.3 },
              { name: 'Phone Stand', profit: 1800, margin: 50 },
            ].map((product, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">Marj: {product.margin.toFixed(1)}%</p>
                </div>
                <p className="font-bold text-green-600">₺{product.profit.toLocaleString('tr-TR')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Loss Making Products */}
        <div className="card">
          <div className="card-header">⚠️ Risk Altındaki Ürünler</div>

          <div className="space-y-3">
            {[
              { name: 'Screen Protector', loss: -450, margin: -10 },
              { name: 'Old Charger', loss: -320, margin: -8 },
              { name: 'Damaged Stock', loss: -180, margin: -5 },
            ].map((product, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">Marj: {product.margin.toFixed(1)}%</p>
                </div>
                <p className="font-bold text-red-600">₺{product.loss.toLocaleString('tr-TR')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Financial Insights */}
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
        <div className="card-header text-blue-900">🧠 AI Finansal İçgörüler</div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Fiyatlandırma Önerisi</h4>
            <p className="text-sm text-gray-700 mb-3">
              Screen Protector fiyatını ₺45'ten ₺55'e yükselterek marjı %10'dan %22'ye çıkarabili rsiniz.
            </p>
            <button onClick={handlePricingOptimization} disabled={loading} className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50">
              {loading ? '⏳ İşleniyor...' : 'Uygula →'}
            </button>
          </div>

          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Stok Yönetimi</h4>
            <p className="text-sm text-gray-700 mb-3">
              Phone Stand stoku bitme riski taşıyor. Talep tahminine göre 50 adet daha sipariş öneririz.
            </p>
            <button onClick={handleOrderPlacement} disabled={loading} className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50">
              {loading ? '⏳ İşleniyor...' : 'Sipariş Ver →'}
            </button>
          </div>

          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Kar Maksimizasyonu</h4>
            <p className="text-sm text-gray-700 mb-3">
              Wireless Headphones daha agresif pazarlamaya koyulursa satışlar %30 artabilir.
            </p>
            <button onClick={handleProfitMaximization} disabled={loading} className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50">
              {loading ? '⏳ İşleniyor...' : 'Detaylar →'}
            </button>
          </div>

          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Keskinlik Analizi</h4>
            <p className="text-sm text-gray-700 mb-3">
              Son 7 günde USD volatilitesi yükseldi. Fiyatları ABD'den ithal ürünler için kontrol edin.
            </p>
            <button onClick={handleRiskAnalysis} disabled={loading} className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50">
              {loading ? '⏳ İşleniyor...' : 'Analiz →'}
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="card">
        <div className="card-header">📅 Aylık Dağılım</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="border-b-2 border-gray-200 text-gray-600">
              <tr>
                <th className="py-3 px-4 text-left">Ay</th>
                <th className="py-3 px-4">Gelir</th>
                <th className="py-3 px-4">Maliyet</th>
                <th className="py-3 px-4">Brüt Kar</th>
                <th className="py-3 px-4">Marj %</th>
                <th className="py-3 px-4">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { month: 'Ocak', revenue: 35000, cost: 25000, profit: 10000, margin: 28.6, trend: '↑' },
                { month: 'Şubat', revenue: 42000, cost: 30000, profit: 12000, margin: 28.6, trend: '↑' },
                { month: 'Mart', revenue: 45000, cost: 33000, profit: 12000, margin: 26.7, trend: '↓' },
                { month: 'Nisan', revenue: 48000, cost: 35000, profit: 13000, margin: 27.1, trend: '↑' },
                { month: 'Mayıs', revenue: 50000, cost: 37500, profit: 12500, margin: 25, trend: '↓' },
              ].map((row) => (
                <tr key={row.month} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-left font-medium">{row.month}</td>
                  <td className="py-3 px-4">₺{row.revenue.toLocaleString('tr-TR')}</td>
                  <td className="py-3 px-4">₺{row.cost.toLocaleString('tr-TR')}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">₺{row.profit.toLocaleString('tr-TR')}</td>
                  <td className="py-3 px-4">{row.margin.toFixed(1)}%</td>
                  <td className="py-3 px-4">
                    <span className={row.trend === '↑' ? 'text-green-600' : 'text-red-600'}>
                      {row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Reports */}
      <div className="flex gap-4">
        <button className="btn-primary">📊 Rapor Indir (PDF)</button>
        <button className="btn-secondary">📤 Excel'e Aktar</button>
        <button className="btn-success">📧 E-posta Gönder</button>
      </div>
    </div>
  );
}
