'use client';

/**
 * Dashboard Page - Main Overview
 * Shows key metrics and agent recommendations
 */

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ana Pano</h1>
        <p className="text-gray-600 mt-2">Gerçek zamanlı satış ve finansal metrikleri izleyin</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="metric-box">
          <div className="metric-label">Toplam Gelir</div>
          <div className="metric-value">₺50.000</div>
          <p className="text-sm text-blue-600 mt-2">↑ %12 bu ayda</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Toplam Kar</div>
          <div className="metric-value">₺12.500</div>
          <p className="text-sm text-blue-600 mt-2">↑ %8 bu ayda</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Kar Marjı</div>
          <div className="metric-value">25%</div>
          <p className="text-sm text-blue-600 mt-2">Ortalamanın üstü</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Aktif Ürün</div>
          <div className="metric-value">24</div>
          <p className="text-sm text-blue-600 mt-2">8 ürün risk altında</p>
        </div>
      </div>

      {/* Agent Status and Recommendations */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Agent Actions */}
        <div className="card">
          <div className="card-header">🤖 Son Agent Eylemleri</div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-green-900">Fiyat Optimizasyonu</p>
                  <p className="text-sm text-green-700 mt-1">3 ürünün fiyatı otomatik güncellendi</p>
                </div>
                <span className="status-badge status-success">BAŞARILI</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">3 dakika önce</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-blue-900">Rakip Analizi</p>
                  <p className="text-sm text-blue-700 mt-1">Pazarda 5 yeni rakip tespit edildi</p>
                </div>
                <span className="status-badge status-info">BİLGİ</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">15 dakika önce</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-yellow-900">Açıklama Iyileştirmesi</p>
                  <p className="text-sm text-yellow-700 mt-1">1 ürün açıklaması optimize edildi</p>
                </div>
                <span className="status-badge status-warning">UYARI</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">1 saat önce</p>
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="card">
          <div className="card-header">⚠️ Risk Uyarıları</div>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-red-900">Düşük Kar Marjı Ürünler</p>
              <p className="text-sm text-red-700 mt-1">8 ürün %10 altında marjla satılıyor</p>
              <button className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700">
                Ayrıntıları Gör →
              </button>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="font-semibold text-orange-900">Stok Riski</p>
              <p className="text-sm text-orange-700 mt-1">3 ürün stokta 5 birimden az</p>
              <button className="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-700">
                Yönet →
              </button>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="font-semibold text-yellow-900">Fiyat Anomalileri</p>
              <p className="text-sm text-yellow-700 mt-1">Rakiplerden 40% daha yüksek fiyat</p>
              <button className="mt-3 text-sm font-semibold text-yellow-600 hover:text-yellow-700">
                Öner →
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
            <p className="text-sm text-gray-600 mb-2">Min. Kar Marjı</p>
            <input
              type="number"
              defaultValue={15}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">%15 tavsiye edilir</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Max Fiyat Değişimi</p>
            <input
              type="number"
              defaultValue={30}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">% olarak</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Güncelleme Sıklığı</p>
            <select defaultValue="Günlük" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
              <option>Saatlik</option>
              <option>Günlük</option>
              <option>Haftalık</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-gray-700">Otomatik Optimizasyon Etkin</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-gray-700">Bildirimler Etkin</span>
          </label>
        </div>

        <button className="btn-primary mt-6">Ayarları Kaydet</button>
      </div>
    </div>
  );
}
