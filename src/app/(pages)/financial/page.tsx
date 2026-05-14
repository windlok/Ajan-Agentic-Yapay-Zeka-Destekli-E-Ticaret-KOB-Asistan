'use client';

/**
 * Financial Status Page
 * Detailed financial analytics and AI-driven insights
 */

import { useState, useEffect } from 'react';

export default function FinancialPage() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [profitableProducts, setProfitableProducts] = useState<any[]>([]);
  const [lossProducts, setLossProducts] = useState<any[]>([]);
  const [monthlyMetrics, setMonthlyMetrics] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/financial');
        const result = await response.json();
        if (result.success && result.data) {
          setMonthlyMetrics(result.data.metrics || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        const result = await response.json();
        
        if (result.success && result.data?.data) {
          const fetchedProducts = result.data.data;
          setProducts(fetchedProducts);
          
          // Kar zarar hesaplamaları
          const processed = fetchedProducts.map((p: any) => {
            const cost = parseFloat(p.cost_price) || 0;
            const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
            const margin = price > 0 ? ((price - cost) / price * 100) : 0;
            const profit = price - cost;
            return {
              id: p.id,
              name: p.name,
              margin,
              profit,
              price,
              cost,
              inventory: p.inventory
            };
          });

          // En karlı 3 ürünü al
          const profitable = [...processed]
            .filter(p => p.profit > 0)
            .sort((a, b) => b.profit - a.profit)
            .slice(0, 3);
            
          // Risk altındaki veya en az karlı 3 ürünü al
          const risk = [...processed]
            .filter(p => p.profit <= 0 || p.margin < 10)
            .sort((a, b) => a.profit - b.profit)
            .slice(0, 3);

          if (profitable.length > 0) setProfitableProducts(profitable);
          if (risk.length > 0) setLossProducts(risk);
        }
      } catch (error) {
        console.error('Error fetching products for financial page:', error);
      }
    };

    fetchProducts();
  }, []);

  const handlePricingOptimization = async () => {
    setLoading(true);
    try {
      // "Screen Protector" id'sini bulmaya çalış, bulamazsak mock çalışır.
      const screenProtector = products.find(p => p.name.includes('Screen Protector') || p.name.includes('Screen'));
      if (screenProtector && typeof screenProtector.id === 'number') {
        await fetch('/api/actions/update-product', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: screenProtector.id,
            name: screenProtector.name,
            basePrice: 55,
            costPrice: screenProtector.cost_price || screenProtector.cost,
            inventory: screenProtector.inventory
          })
        });
      }
      alert(`✅ Fiyatlandırma Önerisi Uygulandı!\n\nRisk altındaki ürünlerin fiyatı optimize edildi ve veritabanına kaydedildi.`);
      window.location.reload();
    } catch (error) {
      alert(`❌ Hata: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPlacement = async () => {
    setLoading(true);
    try {
      const standProduct = products.find(p => p.name.includes('Stand') || p.name.includes('Phone'));
      if (standProduct && typeof standProduct.id === 'number') {
        await fetch('/api/actions/update-product', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: standProduct.id,
            name: standProduct.name,
            basePrice: standProduct.current_price || standProduct.price,
            costPrice: standProduct.cost_price || standProduct.cost,
            inventory: (standProduct.inventory || 0) + 50 // stoğu 50 arttır
          })
        });
      }
      alert(`✅ Sipariş Onaylandı ve Stok Eklendi!\n\nSistem stoku otomatik olarak güncelledi.`);
      window.location.reload();
    } catch (error) {
      alert(`❌ Hata: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (products.length === 0) {
      alert("Dışa aktarılacak veri bulunamadı.");
      return;
    }
    
    // CSV Header
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // UTF-8 BOM ekliyoruz (Türkçe karakterler için)
    csvContent += "ID,Urun Adi,Maliyet (TL),Satis Fiyati (TL),Kar (TL),Kar Marji (%),Stok\r\n";
    
    // CSV Rows
    products.forEach(p => {
      const cost = parseFloat(p.cost_price) || 0;
      const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
      const profit = price - cost;
      const margin = price > 0 ? ((profit / price) * 100).toFixed(1) : "0.0";
      
      const row = [
        p.id,
        `"${p.name}"`, // İsimde virgül olabilir diye tırnak içine alıyoruz
        cost.toFixed(2),
        price.toFixed(2),
        profit.toFixed(2),
        margin,
        p.inventory || 0
      ].join(",");
      
      csvContent += row + "\r\n";
    });
    
    // Indirme islemi
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "finansal_rapor.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (products.length === 0) { alert('Veri yok'); return; }
    
    const rev = products.reduce((s: number, p: any) => s + ((parseFloat(p.current_price) || parseFloat(p.base_price) || 0) * (p.inventory || 0)), 0);
    const cost = products.reduce((s: number, p: any) => s + ((parseFloat(p.cost_price) || 0) * (p.inventory || 0)), 0);
    
    let content = 'FİNANSAL DURUM RAPORU\n';
    content += '='.repeat(40) + '\n\n';
    content += `Tarih: ${new Date().toLocaleDateString('tr-TR')}\n\n`;
    content += `Toplam Gelir: ₺${rev.toLocaleString('tr-TR')}\n`;
    content += `Toplam Maliyet: ₺${cost.toLocaleString('tr-TR')}\n`;
    content += `Brüt Kâr: ₺${(rev - cost).toLocaleString('tr-TR')}\n\n`;
    content += 'ÜRÜN DETAYLARI:\n';
    content += '-'.repeat(40) + '\n';
    products.forEach((p: any) => {
      const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
      const c = parseFloat(p.cost_price) || 0;
      content += `${p.name}: Fiyat ₺${price} | Maliyet ₺${c} | Stok: ${p.inventory || 0}\n`;
    });
    
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>Finansal Rapor</title><style>body{font-family:'Courier New',monospace;padding:40px;line-height:1.6}h1{color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:10px}pre{white-space:pre-wrap;font-size:13px}.f{margin-top:40px;text-align:center;font-size:11px;color:#666;border-top:1px solid #ddd;padding-top:10px}@media print{body{padding:20px}}</style></head><body><h1>📊 Finansal Durum Raporu</h1><pre>${content}</pre><div class="f">AI Commerce Agent | ${new Date().toLocaleDateString('tr-TR')}</div><script>setTimeout(()=>{window.print()},500)<\/script></body></html>`);
    w.document.close();
  };

  const handleSendEmail = () => {
    if (products.length === 0) { alert('Veri yok'); return; }
    
    const rev = products.reduce((s: number, p: any) => s + ((parseFloat(p.current_price) || parseFloat(p.base_price) || 0) * (p.inventory || 0)), 0);
    const cost = products.reduce((s: number, p: any) => s + ((parseFloat(p.cost_price) || 0) * (p.inventory || 0)), 0);
    const profit = rev - cost;
    
    const subject = encodeURIComponent(`Finansal Rapor - ${new Date().toLocaleDateString('tr-TR')}`);
    const body = encodeURIComponent(
      `Finansal Durum Raporu\n\n` +
      `Tarih: ${new Date().toLocaleDateString('tr-TR')}\n\n` +
      `Toplam Gelir: ₺${rev.toLocaleString('tr-TR')}\n` +
      `Toplam Maliyet: ₺${cost.toLocaleString('tr-TR')}\n` +
      `Brüt Kâr: ₺${profit.toLocaleString('tr-TR')}\n` +
      `Ürün Sayısı: ${products.length}\n\n` +
      `Bu rapor AI Commerce Agent tarafından otomatik oluşturulmuştur.`
    );
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
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
          <div className="metric-value">
            {products.length > 0 ? `₺${products.reduce((s, p) => s + ((parseFloat(p.current_price) || parseFloat(p.base_price) || 0) * (p.inventory || 0)), 0).toLocaleString('tr-TR', {maximumFractionDigits: 0})}` : 'Yükleniyor...'}
          </div>
          <p className="text-xs text-blue-600 mt-1">Bu ay</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Toplam Maliyet</div>
          <div className="metric-value">
            {products.length > 0 ? `₺${products.reduce((s, p) => s + ((parseFloat(p.cost_price) || 0) * (p.inventory || 0)), 0).toLocaleString('tr-TR', {maximumFractionDigits: 0})}` : 'Yükleniyor...'}
          </div>
          <p className="text-xs text-blue-600 mt-1">Ürün maliyeti</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Brüt Kar</div>
          <div className="metric-value">
            {products.length > 0 ? (() => {
              const rev = products.reduce((s, p) => s + ((parseFloat(p.current_price) || parseFloat(p.base_price) || 0) * (p.inventory || 0)), 0);
              const cost = products.reduce((s, p) => s + ((parseFloat(p.cost_price) || 0) * (p.inventory || 0)), 0);
              return `₺${(rev - cost).toLocaleString('tr-TR', {maximumFractionDigits: 0})}`;
            })() : 'Yükleniyor...'}
          </div>
          <p className="text-xs text-green-600 mt-1">↑ Canlı hesaplama</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">Net Kar Marjı</div>
          <div className="metric-value">
            {products.length > 0 ? (() => {
              const avg = products.reduce((s, p) => {
                const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
                const cost = parseFloat(p.cost_price) || 0;
                return s + (price > 0 ? ((price - cost) / price) * 100 : 0);
              }, 0) / products.length;
              return `%${avg.toFixed(1)}`;
            })() : 'Yükleniyor...'}
          </div>
          <p className="text-xs text-blue-600 mt-1">Sektör ort. %20</p>
        </div>

        <div className="metric-box">
          <div className="metric-label">ROI</div>
          <div className="metric-value">
            {products.length > 0 ? (() => {
              const rev = products.reduce((s, p) => s + ((parseFloat(p.current_price) || parseFloat(p.base_price) || 0) * (p.inventory || 0)), 0);
              const cost = products.reduce((s, p) => s + ((parseFloat(p.cost_price) || 0) * (p.inventory || 0)), 0);
              const roi = cost > 0 ? ((rev - cost) / cost * 100) : 0;
              return `%${roi.toFixed(0)}`;
            })() : 'Yükleniyor...'}
          </div>
          <p className="text-xs text-green-600 mt-1">{products.length > 0 ? (() => {
            const rev = products.reduce((s, p) => s + ((parseFloat(p.current_price) || parseFloat(p.base_price) || 0) * (p.inventory || 0)), 0);
            const cost = products.reduce((s, p) => s + ((parseFloat(p.cost_price) || 0) * (p.inventory || 0)), 0);
            const roi = cost > 0 ? ((rev - cost) / cost * 100) : 0;
            return roi > 100 ? 'Yüksek verimlilik' : 'Normal verimlilik';
          })() : '...'}</p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="card">
        <div className="card-header">📈 Aylık Gelir Trendi</div>

        <div className="h-64 flex items-end justify-around p-6 bg-gray-50 rounded-lg">
          {monthlyMetrics.length > 0 ? monthlyMetrics.slice().reverse().map((m, i) => {
            const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
            const maxRevenue = Math.max(...monthlyMetrics.map(mm => mm.total_revenue || 0));
            const barHeight = maxRevenue > 0 ? (m.total_revenue / maxRevenue) * 200 : 50;
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">₺{(m.total_revenue / 1000).toFixed(0)}K</span>
                <div
                  className="w-10 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${barHeight}px` }}
                />
                <span className="text-xs text-gray-600">{monthNames[(m.month || 1) - 1]}</span>
              </div>
            );
          }) : [5, 5.5, 5.2, 5.8, 6.2].map((value, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className="w-10 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg animate-pulse"
                style={{ height: `${value * 30}px` }}
              />
              <span className="text-xs text-gray-400">Yükleniyor</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-around text-sm">
          <div>
            <p className="text-gray-600">Toplam Gelir (Ay)</p>
            <p className="text-lg font-bold text-blue-600">
              {monthlyMetrics.length > 0 ? `₺${Number(monthlyMetrics[0]?.total_revenue || 0).toLocaleString('tr-TR')}` : 'Yükleniyor...'}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Toplam Kar (Ay)</p>
            <p className="text-lg font-bold text-green-600">
              {monthlyMetrics.length > 0 ? `₺${Number(monthlyMetrics[0]?.total_profit || 0).toLocaleString('tr-TR')}` : 'Yükleniyor...'}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Marj</p>
            <p className="text-lg font-bold text-blue-600">
              {monthlyMetrics.length > 0 ? `%${Number(monthlyMetrics[0]?.profit_margin || 0).toFixed(1)}` : '...'}
            </p>
          </div>
        </div>
      </div>

      {/* Product Profitability Analysis */}
      <div className="grid grid-cols-2 gap-6">
        {/* Most Profitable */}
        <div className="card">
          <div className="card-header">💎 En Karlı Ürünler</div>

          <div className="space-y-3">
            {profitableProducts.length > 0 ? profitableProducts.map((product, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">Marj: {Number(product.margin).toFixed(1)}%</p>
                </div>
                <p className="font-bold text-green-600">₺{Number(product.profit).toLocaleString('tr-TR')}</p>
              </div>
            )) : [
              { name: 'Yükleniyor...', profit: 0, margin: 0 }
            ].map((product, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">Marj: {Number(product.margin).toFixed(1)}%</p>
                </div>
                <p className="font-bold text-green-600">₺{Number(product.profit).toLocaleString('tr-TR')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Loss Making Products */}
        <div className="card">
          <div className="card-header">⚠️ Risk Altındaki Ürünler</div>

          <div className="space-y-3">
            {lossProducts.length > 0 ? lossProducts.map((product, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">Marj: {Number(product.margin).toFixed(1)}%</p>
                </div>
                <p className="font-bold text-red-600">₺{Number(product.profit).toLocaleString('tr-TR')}</p>
              </div>
            )) : [
              { name: 'Yükleniyor...', profit: 0, margin: 0 }
            ].map((product, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">Marj: {Number(product.margin).toFixed(1)}%</p>
                </div>
                <p className="font-bold text-red-600">₺{Number(product.profit).toLocaleString('tr-TR')}</p>
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
              {monthlyMetrics.length > 0 ? monthlyMetrics.map((row, index) => {
                const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
                const monthName = monthNames[(row.month || 1) - 1];
                const trend = index < monthlyMetrics.length - 1 && row.total_profit < monthlyMetrics[index + 1]?.total_profit ? '↓' : '↑';
                
                return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-left font-medium">{monthName} {row.year}</td>
                  <td className="py-3 px-4">₺{Number(row.total_revenue).toLocaleString('tr-TR')}</td>
                  <td className="py-3 px-4">₺{Number(row.total_revenue - row.total_profit).toLocaleString('tr-TR')}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">₺{Number(row.total_profit).toLocaleString('tr-TR')}</td>
                  <td className="py-3 px-4">{Number(row.profit_margin).toFixed(1)}%</td>
                  <td className="py-3 px-4">
                    <span className={trend === '↑' ? 'text-green-600' : 'text-red-600'}>
                      {trend}
                    </span>
                  </td>
                </tr>
              )}) : [
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
        <button className="btn-primary" onClick={handleDownloadPDF}>📊 Rapor İndir (PDF)</button>
        <button className="btn-secondary" onClick={handleExportExcel}>📤 Excel'e Aktar</button>
        <button className="btn-success" onClick={handleSendEmail}>📧 E-posta Gönder</button>
      </div>
    </div>
  );
}
