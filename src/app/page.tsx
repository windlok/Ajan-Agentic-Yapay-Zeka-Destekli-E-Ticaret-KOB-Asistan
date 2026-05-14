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
    <div className="min-h-screen space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-12 shadow-lg">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">🤖 AI Commerce Agent</h1>
          <p className="text-xl mb-6 text-blue-100">
            Gemini AI ile otonom fiyatlandırma, finansal yönetim ve pazar analizi
          </p>
          <p className="text-blue-200 mb-8">
            E-ticaret KOBİ'leri için yapay zeka destekli otonom asistan. Fiyatlarınızı pazara göre
            otomatik güncelleyin, kâr/zarar durumunu gerçek zamanlı izleyin ve müşteri geri bildirimlerine göre
            ürün açıklamalarını optimize edin.
          </p>

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              Dashboard'a Git →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats - SQL'den Dinamik */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">
            {products.length > 0 ? formatK(totalRevenue) : '...'}
          </div>
          <p className="text-gray-600 mt-2">₺ Aylık Gelir</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">
            {products.length > 0 ? formatK(totalProfit) : '...'}
          </div>
          <p className="text-gray-600 mt-2">₺ Aylık Kar</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600">
            {products.length > 0 ? `${avgMargin.toFixed(0)}%` : '...'}
          </div>
          <p className="text-gray-600 mt-2">Kar Marjı</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-600">
            {products.length > 0 ? products.length : '...'}
          </div>
          <p className="text-gray-600 mt-2">Aktif Ürün</p>
        </div>
      </div>

      {/* Main Features */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">🎯 Temel Özellikler</h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="card hover:shadow-lg transition">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Fiyat Optimizasyonu</h3>
            <p className="text-gray-600 mb-4">
              Gemini AI pazarı analiz ederek ürünlerinizi otomatik olarak en uygun fiyata getiriyor.
            </p>
          </div>

          <div className="card hover:shadow-lg transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Finansal Analiz</h3>
            <p className="text-gray-600 mb-4">
              Gerçek zamanlı kar/zarar hesaplaması ve AI-powered finansal öneriler.
            </p>
          </div>

          <div className="card hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Rakip Analizi</h3>
            <p className="text-gray-600 mb-4">
              Pazar trendleri ve rakip fiyatlandırması otomatik olarak izlenir.
            </p>
          </div>

          <div className="card hover:shadow-lg transition">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Açıklama Optimizasyonu</h3>
            <p className="text-gray-600 mb-4">
              Müşteri geri bildirimlerine göre ürün açıklamaları AI tarafından iyileştirilir.
            </p>
          </div>

          <div className="card hover:shadow-lg transition">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Otonom Agent</h3>
            <p className="text-gray-600 mb-4">
              Sistem bağımsız olarak çalışır, kararlar alır ve aksiyonlar uygular.
            </p>
          </div>

          <div className="card hover:shadow-lg transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Gerçek Zamanlı</h3>
            <p className="text-gray-600 mb-4">
              Güncellemeler anında gerçekleşir, hiçbir gecikme yok.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-gray-100 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🛠 Teknoloji Yığını</h2>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Frontend & Backend</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Next.js 14 (Full-Stack)</li>
              <li>✓ TypeScript</li>
              <li>✓ Tailwind CSS</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">AI & Database</h3>
            <ul className="space-y-2 text-gray-700">
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
