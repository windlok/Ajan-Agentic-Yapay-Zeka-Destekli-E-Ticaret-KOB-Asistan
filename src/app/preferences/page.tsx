'use client';

export default function PreferencesPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Kullanıcı Tercihleri</h1>

      <div className="grid grid-cols-1 gap-6">
        {/* API Settings */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">🔑 API Ayarları</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Google Gemini API Anahtarı</label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="sk-..."
                defaultValue="••••••••••••••••"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Güncelle
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">API anahtarı güvenli şekilde saklanır</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Database Bağlantısı</label>
            <input
              type="password"
              placeholder="postgresql://..."
              defaultValue="••••••••••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">PostgreSQL bağlantı dizesi</p>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">🔔 Bildirim Ayarları</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="email-notify" defaultChecked className="w-4 h-4 rounded" />
              <label htmlFor="email-notify" className="ml-3 text-sm">
                E-posta bildirimleri
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="price-notify" defaultChecked className="w-4 h-4 rounded" />
              <label htmlFor="price-notify" className="ml-3 text-sm">
                Fiyat değişim uyarıları
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="inventory-notify" defaultChecked className="w-4 h-4 rounded" />
              <label htmlFor="inventory-notify" className="ml-3 text-sm">
                Stok uyarıları
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="daily-report" className="w-4 h-4 rounded" />
              <label htmlFor="daily-report" className="ml-3 text-sm">
                Günlük özet rapor
              </label>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">🎨 Görünüm Ayarları</h2>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Tema</label>
            <select defaultValue="Açık (Light)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Açık (Light)</option>
              <option>Koyu (Dark)</option>
              <option>Otomatik (Sistem)</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button className="btn-primary px-6">
            💾 Değişiklikleri Kaydet
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}
