'use client';

export default function PreferencesPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kullanıcı Tercihleri</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">API anahtarlarınızı ve bildirim ayarlarını buradan yönetin</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* API Settings */}
        <div className="card bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>🔑</span> API Ayarları
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Google Gemini API Anahtarı</label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="sk-..."
                defaultValue="••••••••••••••••"
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition">
                Güncelle
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">API anahtarı güvenli şekilde saklanır</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Database Bağlantısı</label>
            <input
              type="password"
              placeholder="postgresql://..."
              defaultValue="••••••••••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PostgreSQL bağlantı dizesi</p>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>🔔</span> Bildirim Ayarları
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center cursor-pointer select-none">
              <input type="checkbox" id="email-notify" defaultChecked className="w-4 h-4 text-blue-600 rounded dark:bg-slate-700 dark:border-slate-600 focus:ring-0" />
              <label htmlFor="email-notify" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                E-posta bildirimleri
              </label>
            </div>
            <div className="flex items-center cursor-pointer select-none">
              <input type="checkbox" id="price-notify" defaultChecked className="w-4 h-4 text-blue-600 rounded dark:bg-slate-700 dark:border-slate-600 focus:ring-0" />
              <label htmlFor="price-notify" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Fiyat değişim uyarıları
              </label>
            </div>
            <div className="flex items-center cursor-pointer select-none">
              <input type="checkbox" id="inventory-notify" defaultChecked className="w-4 h-4 text-blue-600 rounded dark:bg-slate-700 dark:border-slate-600 focus:ring-0" />
              <label htmlFor="inventory-notify" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Stok uyarıları
              </label>
            </div>
            <div className="flex items-center cursor-pointer select-none">
              <input type="checkbox" id="daily-report" className="w-4 h-4 text-blue-600 rounded dark:bg-slate-700 dark:border-slate-600 focus:ring-0" />
              <label htmlFor="daily-report" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Günlük özet rapor
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/10 hover:shadow-xl transition duration-200">
            💾 Değişiklikleri Kaydet
          </button>
          <button className="px-6 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-600 transition duration-200">
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}
