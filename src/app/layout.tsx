import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Commerce Agent - KOBİ Otonom Asistan',
  description: 'E-ticaret KOBİ\'leri için Gemini AI tabanlı otonom fiyatlandırma ve finansal yönetim sistemi',
  keywords: 'e-commerce, AI, pricing, KOBİ, gemini, agentic AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-md">
            <nav className="p-6">
              <h1 className="text-2xl font-bold text-blue-600 mb-8">🤖 AI Agent</h1>

              <ul className="space-y-4">
                <li>
                  <a
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
                  >
                    📊 Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/products"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
                  >
                    📦 Ürünler
                  </a>
                </li>
                <li>
                  <a
                    href="/financial"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
                  >
                    💰 Finansal Durum
                  </a>
                </li>
              </ul>

              <hr className="my-6" />

              <div className="text-xs text-gray-500">
                <p className="font-semibold mb-2">Ayarlar</p>
                <a href="/preferences" className="block hover:text-blue-600 py-1">
                  Tercihler
                </a>
                <a href="/preferences#api" className="block hover:text-blue-600 py-1">
                  API Anahtarı
                </a>
                <a href="/" className="block hover:text-blue-600 py-1">
                  Çıkış
                </a>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <header className="bg-white shadow-sm border-b">
              <div className="px-8 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Hackathon 26 - AI Commerce Agent</h2>
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    🚀 Agentic Analiz Başlat
                  </button>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <div className="p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
