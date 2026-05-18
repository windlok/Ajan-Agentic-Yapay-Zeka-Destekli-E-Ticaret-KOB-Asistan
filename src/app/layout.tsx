import type { Metadata } from 'next';
import './globals.css';
import AgentStartButton from '@/components/AgentStartButton';
import NotificationBell from '@/components/NotificationBell';
import DarkModeToggle from '@/components/DarkModeToggle';
import AIChatbot from '@/components/AIChatbot';
import PriceSimulator from '@/components/PriceSimulator';

export const metadata: Metadata = {
  title: 'AI Commerce Agent - KOBİ Otonom Asistan',
  description: 'E-ticaret KOBİ\'leri için Gemini AI tabanlı otonom fiyatlandırma ve finansal yönetim sistemi',
  keywords: 'e-commerce, AI, pricing, KOBİ, gemini, agentic AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="transition-colors duration-200">
      <body className="bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-gray-100 min-h-screen">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transition-colors duration-200">
            <nav className="p-6">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-8 flex items-center gap-2">
                <span>🤖</span> AI Agent
              </h1>

              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200"
                  >
                    <span>📊</span> Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/products"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200"
                  >
                    <span>📦</span> Ürünler
                  </a>
                </li>
                <li>
                  <a
                    href="/financial"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200"
                  >
                    <span>💰</span> Finansal Durum
                  </a>
                </li>
                <li className="pt-2">
                  <PriceSimulator />
                </li>
              </ul>

              <hr className="my-6 border-gray-100 dark:border-slate-700" />

              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="font-semibold mb-2 uppercase tracking-wider text-gray-400 dark:text-gray-500">Ayarlar</p>
                <a href="/preferences" className="block hover:text-blue-600 dark:hover:text-blue-400 py-1.5 transition">
                  Tercihler
                </a>
                <a href="/preferences#api" className="block hover:text-blue-600 dark:hover:text-blue-400 py-1.5 transition">
                  API Anahtarı
                </a>
                <a href="/" className="block hover:text-blue-600 dark:hover:text-blue-400 py-1.5 transition">
                  Çıkış
                </a>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-h-screen">
            {/* Top Bar */}
            <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 transition-colors duration-200 shadow-sm">
              <div className="px-8 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Hackathon 26 - AI Commerce Agent
                </h2>
                <div className="flex items-center gap-3">
                  <DarkModeToggle />
                  <NotificationBell />
                  <AgentStartButton />
                </div>
              </div>
            </header>

            {/* Page Content */}
            <div className="p-8 flex-1 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
              {children}
            </div>
          </main>
        </div>

        {/* Floating AI Chatbot */}
        <AIChatbot />
      </body>
    </html>
  );
}
