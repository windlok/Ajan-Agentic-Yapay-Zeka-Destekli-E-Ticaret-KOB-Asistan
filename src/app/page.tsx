'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const result = await res.json();
        if (result.success && result.data?.data) {
          setProducts(result.data.data);
        }
      } catch (e) {
        console.error('Ana sayfa veri çekme hatası:', e);
      }
    };
    fetchProducts();
  }, []);

  // Dinamik hesaplamalar
  const totalRevenue = products.reduce((s, p) => {
    const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
    return s + price * (parseInt(p.inventory) || 0);
  }, 0);

  const totalProfit = products.reduce((s, p) => {
    const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
    const cost = parseFloat(p.cost_price) || 0;
    return s + (price - cost) * (parseInt(p.inventory) || 0);
  }, 0);

  const avgMargin = products.length > 0
    ? products.reduce((s, p) => {
        const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
        const cost = parseFloat(p.cost_price) || 0;
        return s + (price > 0 ? ((price - cost) / price) * 100 : 0);
      }, 0) / products.length
    : 0;

  const formatK = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  return (
    <div className="min-h-screen space-y-12 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-12 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="max-w-2xl relative z-10">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">🤖 AI Commerce Agent</h1>
          <p className="text-xl mb-6 text-blue-100 font-medium">
            Gemini AI ile otonom fiyatlandırma, finansal yönetim and pazar analizi
          </p>
          <p className="text-blue-150 mb-8 text-sm leading-relaxed opacity-90">
            E-ticaret KOBİ&apos;leri için yapay zeka destekli otonom asistan. Fiyatlarınızı pazara göre
            otomatik güncelleyin, kâr/zarar durumunu gerçek zamanlı izleyin ve müşteri geri bildirimlerine göre
            ürün açıklamalarını optimize edin.
          </p>

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 shadow-md transition duration-200"
            >
              Dashboard&apos;a Git →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats - SQL&apos;den Dinamik */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card text-center border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {products.length > 0 ? formatK(totalRevenue) : '...'}
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-2">₺ Aylık Gelir</p>
        </div>
        <div className="card text-center border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {products.length > 0 ? formatK(totalProfit) : '...'}
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-2">₺ Aylık Kar</p>
        </div>
        <div className="card text-center border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="text-3xl font-extrabold text-purple-650 dark:text-purple-400">
            {products.length > 0 ? `${avgMargin.toFixed(0)}%` : '...'}
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-2">Kar Marjı</p>
        </div>
        <div className="card text-center border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">
            {products.length > 0 ? products.length : '...'}
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-2">Aktif Ürün</p>
        </div>
      </div>

      {/* Main Features */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
          <span>🎯</span> Temel Özellikler
        </h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="card hover:shadow-md border border-gray-100 dark:border-slate-700/60 transition duration-200">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Fiyat Optimizasyonu</h3>
            <p className="text-sm text-gray-600 dark:text-gray-450 leading-relaxed">
               Gemini AI pazarı analiz ederek ürünlerinizi otomatik olarak en uygun fiyata getiriyor.
            </p>
          </div>

          <div className="card hover:shadow-md border border-gray-100 dark:border-slate-700/60 transition duration-200">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Finansal Analiz</h3>
            <p className="text-sm text-gray-600 dark:text-gray-450 leading-relaxed">
               Gerçek zamanlı kar/zarar hesaplaması ve AI-powered finansal öneriler.
            </p>
          </div>

          <div className="card hover:shadow-md border border-gray-100 dark:border-slate-700/60 transition duration-200">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Rakip Analizi</h3>
            <p className="text-sm text-gray-600 dark:text-gray-450 leading-relaxed">
               Pazar trendleri ve rakip fiyatlandırması otomatik olarak izlenir.
            </p>
          </div>

          <div className="card hover:shadow-md border border-gray-100 dark:border-slate-700/60 transition duration-200">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Açıklama Optimizasyonu</h3>
            <p className="text-sm text-gray-600 dark:text-gray-450 leading-relaxed">
               Müşteri geri bildirimlerine göre ürün açıklamaları AI tarafından iyileştirilir.
            </p>
          </div>

          <div className="card hover:shadow-md border border-gray-100 dark:border-slate-700/60 transition duration-200">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Otonom Agent</h3>
            <p className="text-sm text-gray-600 dark:text-gray-450 leading-relaxed">
               Sistem bağımsız olarak çalışır, kararlar alır ve aksiyonlar uygular.
            </p>
          </div>

          <div className="card hover:shadow-md border border-gray-100 dark:border-slate-700/60 transition duration-200">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Gerçek Zamanlı</h3>
            <p className="text-sm text-gray-600 dark:text-gray-450 leading-relaxed">
               Güncellemeler anında gerçekleşir, hiçbir gecikme yok.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-gray-100 dark:bg-slate-800/40 rounded-2xl p-8 border border-transparent dark:border-slate-700/50 shadow-inner">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span>🛠</span> Teknoloji Yığını
        </h2>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Frontend & Backend</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
              <li>✓ Next.js 14 (Full-Stack)</li>
              <li>✓ TypeScript</li>
              <li>✓ Tailwind CSS</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">AI & Database</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
              <li>✓ Google Gemini API</li>
              <li>✓ Supabase (PostgreSQL)</li>
              <li>✓ Agentic Architecture</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
