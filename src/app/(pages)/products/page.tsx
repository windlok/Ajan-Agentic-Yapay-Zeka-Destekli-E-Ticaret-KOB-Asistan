'use client';

/**
 * Products Management Page
 * Manage products, view agent recommendations, and optimize pricing
 */

import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Modal state for reports
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');

  // Mock products as fallback
  const mockProducts = [
    {
      id: 'test-1',
      name: 'Wireless Headphones',
      price: 450,
      costPrice: 200,
      competitors: 420,
      margin: 55.6,
      inventory: 45,
      recommendation: 'Fiyat düşürün',
      confidence: 0.92,
    },
    {
      id: 'test-2',
      name: 'USB-C Cable',
      price: 89,
      costPrice: 30,
      competitors: 85,
      margin: 66.3,
      inventory: 120,
      recommendation: 'Fiyat uygun',
      confidence: 0.85,
    },
    {
      id: 'test-3',
      name: 'Phone Stand',
      price: 120,
      costPrice: 60,
      competitors: 150,
      margin: 50,
      inventory: 3,
      recommendation: 'Stok yükselt',
      confidence: 0.88,
    },
    {
      id: 'test-4',
      name: 'Screen Protector',
      price: 45,
      costPrice: 50,
      competitors: 35,
      margin: -10,
      inventory: 200,
      recommendation: 'Fiyat ₺55 olmalı',
      confidence: 0.96,
    },
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        const result = await response.json();
        
        console.log('API Result:', result); // Debug için log ekledik

        if (result.success && result.data?.data && result.data.data.length > 0) {
          // Map database fields to component fields
          const mappedProducts = result.data.data.map((p: any) => {
            const costPrice = parseFloat(p.cost_price) || 0;
            const currentPrice = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
            const competitorPrices = p.competitor_prices || {};
            const avgCompetitorPrice = Object.values(competitorPrices).length > 0 
              ? (Object.values(competitorPrices) as number[]).reduce((a, b) => a + b, 0) / Object.values(competitorPrices).length 
              : 0;
            const marginValue = currentPrice > 0 ? ((currentPrice - costPrice) / currentPrice * 100) : 0;
            
            // Dinamik öneri oluştur
            let recommendationText = 'Analiz Yapılıyor';
            let confidenceValue = 0.75;
            
            if (marginValue < 0) {
              recommendationText = 'Zararına satış! Fiyat artırın';
              confidenceValue = 0.95;
            } else if (avgCompetitorPrice > 0 && currentPrice > avgCompetitorPrice * 1.05) {
              recommendationText = 'Fiyat rakiplerin üstünde, düşürün';
              confidenceValue = 0.88;
            } else if (avgCompetitorPrice > 0 && currentPrice < avgCompetitorPrice * 0.95) {
              recommendationText = 'Fiyat düşük, artırabilirsiniz';
              confidenceValue = 0.92;
            } else if (p.inventory < 10) {
              recommendationText = 'Stok çok az, tedarik edin';
              confidenceValue = 0.85;
            } else if (marginValue > 40) {
              recommendationText = 'Harika marj, stok yükselt';
              confidenceValue = 0.90;
            } else {
              recommendationText = 'Fiyat uygun, takipte kalın';
              confidenceValue = 0.82;
            }
            
            return {
              id: p.id,
              name: p.name,
              price: currentPrice,
              costPrice: costPrice,
              competitors: Math.round(avgCompetitorPrice),
              margin: parseFloat(marginValue.toFixed(1)),
              inventory: p.inventory || 0,
              recommendation: recommendationText,
              confidence: confidenceValue,
            };
          });
          setProducts(mappedProducts);
        } else {
          console.warn('API success false veya veri boş, fallback kullanılıyor');
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(mockProducts);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price,
      costPrice: product.costPrice,
      inventory: product.inventory,
    });
  };

  const handleEditSave = async () => {
    if (!editingProduct) return;

    setLoading(true);
    try {
      const response = await fetch('/api/actions/update-product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: editingProduct.id,
          name: editFormData.name,
          description: `Updated ${editFormData.name}`,
          basePrice: parseInt(editFormData.price),
          costPrice: parseInt(editFormData.costPrice),
          inventory: parseInt(editFormData.inventory),
        }),
      });
      const data = await response.json();
      
      // Refresh products list
      const refreshResponse = await fetch('/api/products', { cache: 'no-store' });
      const refreshResult = await refreshResponse.json();
      if (refreshResult.success && refreshResult.data?.data) {
        const mappedProducts = refreshResult.data.data.map((p: any) => {
          const costPrice = parseFloat(p.cost_price) || 0;
          const currentPrice = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
          const competitorPrices = p.competitor_prices || {};
          const avgCompetitorPrice = Object.values(competitorPrices).length > 0 
            ? (Object.values(competitorPrices) as number[]).reduce((a, b) => a + b, 0) / Object.values(competitorPrices).length 
            : 0;
          const marginValue = currentPrice > 0 ? ((currentPrice - costPrice) / currentPrice * 100) : 0;
          
          // Dinamik öneri oluştur
          let recommendationText = 'Analiz Yapılıyor';
          let confidenceValue = 0.75;
          
          if (marginValue < 0) {
            recommendationText = 'Zararına satış! Fiyat artırın';
            confidenceValue = 0.95;
          } else if (avgCompetitorPrice > 0 && currentPrice > avgCompetitorPrice * 1.05) {
            recommendationText = 'Fiyat rakiplerin üstünde, düşürün';
            confidenceValue = 0.88;
          } else if (avgCompetitorPrice > 0 && currentPrice < avgCompetitorPrice * 0.95) {
            recommendationText = 'Fiyat düşük, artırabilirsiniz';
            confidenceValue = 0.92;
          } else if (p.inventory < 10) {
            recommendationText = 'Stok çok az, tedarik edin';
            confidenceValue = 0.85;
          } else if (marginValue > 40) {
            recommendationText = 'Harika marj, stok yükselt';
            confidenceValue = 0.90;
          } else {
            recommendationText = 'Fiyat uygun, takipte kalın';
            confidenceValue = 0.82;
          }
          
          return {
            id: p.id,
            name: p.name,
            price: currentPrice,
            costPrice: costPrice,
            competitors: Math.round(avgCompetitorPrice),
            margin: parseFloat(marginValue.toFixed(1)),
            inventory: p.inventory || 0,
            recommendation: recommendationText,
            confidence: confidenceValue,
          };
        });
        setProducts(mappedProducts);
      }
      
      const marginVal = data.newMargin || ((parseInt(editFormData.price) - parseInt(editFormData.costPrice)) / parseInt(editFormData.price) * 100).toFixed(1);
      alert(`✅ ${editFormData.name} başarıyla güncellendi!\n\nYeni Fiyat: ₺${editFormData.price}\nKar Marjı: %${marginVal}`);
      setEditingProduct(null);
    } catch (error) {
      alert(`❌ Hata: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkOptimize = async () => {
    if (!confirm('Tüm ürünlerin fiyatlarını yapay zeka önerilerine göre otomatik optimize etmek istiyor musunuz? Bu işlem veri tabanına kaydedilecektir.')) return;
    
    setLoading(true);
    let successCount = 0;
    
    try {
      // Sadece mock olmayan, veritabanından gelen id'ye sahip olanları filtrele (id string olanlar mock)
      // veya hepsini optimize etmeye çalışalım
      for (const p of products) {
        let newPrice = p.price;
        // Basit optimizasyon mantığı (AI simülasyonu)
        if (p.margin < 0) {
          newPrice = Math.round(p.costPrice * 1.2); // %20 kar marjı hedefle
        } else if (p.competitors > 0 && p.price > p.competitors * 1.05) {
          newPrice = Math.round(p.competitors * 0.98); // Rakiplerin %2 altına in
        } else if (p.competitors > 0 && p.price < p.competitors * 0.95) {
          newPrice = Math.round(p.competitors * 0.95); // Fiyatı biraz yukarı çek
        }
        
        if (newPrice !== p.price && typeof p.id === 'number') {
          // Güncelleme yap
          await fetch('/api/actions/update-product', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: p.id,
              name: p.name,
              description: `AI Optimized ${p.name}`,
              basePrice: newPrice,
              costPrice: p.costPrice,
              inventory: p.inventory,
            }),
          });
          successCount++;
        }
      }
      
      alert(`✅ Toplu optimizasyon tamamlandı! ${successCount} ürünün fiyatı güncellendi.`);
      // Sayfayı yenilemek için window reload yapılabilir veya fetchProducts çağrılabilir
      window.location.reload();
    } catch (error) {
      alert(`❌ Optimizasyon sırasında hata: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImproveDescriptions = async () => {
    setLoading(true);
    try {
      // Her ürün için açıklama iyileştirme önerisi oluştur
      let report = '🤖 AI AÇIKLAMA İYİLEŞTİRME RAPORU\n';
      report += '═'.repeat(45) + '\n\n';
      report += `📅 Tarih: ${new Date().toLocaleDateString('tr-TR')}\n`;
      report += `📦 Toplam Ürün: ${products.length}\n\n`;
      
      for (const p of products) {
        const price = p.price || 0;
        const margin = p.margin || 0;
        
        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        report += `📌 ${p.name}\n`;
        report += `   Fiyat: ₺${price} | Marj: %${margin.toFixed(1)}\n\n`;
        
        // SEO ve açıklama önerileri
        if (margin < 0) {
          report += `   ⚠️ Mevcut Durum: Zarar eden ürün\n`;
          report += `   💡 Öneri: "Sınırlı stok - son fırsat" gibi aciliyet \n      yaratan ifadeler kullanın. Fiyat artışı ile birlikte\n      premium algısı oluşturun.\n`;
        } else if (margin > 40) {
          report += `   ✅ Mevcut Durum: Yüksek marjlı ürün\n`;
          report += `   💡 Öneri: "En çok satan", "Müşteri favorisi" gibi\n      sosyal kanıt ifadeleri ekleyin. Detaylı teknik\n      özellikler ile premium konumlandırma yapın.\n`;
        } else {
          report += `   📊 Mevcut Durum: Ortalama performans\n`;
          report += `   💡 Öneri: Rakip ürünlerden fark yaratan özellikleri\n      ön plana çıkarın. Anahtar kelimeleri SEO uyumlu\n      şekilde açıklamaya ekleyin.\n`;
        }
        report += '\n';
      }
      
      report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      report += '\n📋 GENEL ÖNERİLER:\n';
      report += '• Tüm ürün açıklamalarına anahtar kelime ekleyin\n';
      report += '• Müşteri yorumlarından çıkan güçlü noktaları vurgulayın\n';
      report += '• Her açıklamayı 150-300 karakter arasında tutun\n';
      report += '• Teknik özellikler madde madde listelensin\n';
      
      setReportTitle('🤖 Açıklama İyileştirme Raporu');
      setReportContent(report);
      setReportModalOpen(true);
    } catch (error) {
      alert(`❌ Hata: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFinancialReport = async () => {
    setLoading(true);
    try {
      // Ürün verilerinden kapsamlı finansal rapor oluştur
      const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.inventory), 0);
      const totalCost = products.reduce((sum, p) => sum + (p.costPrice * p.inventory), 0);
      const totalProfit = totalRevenue - totalCost;
      const avgMargin = products.length > 0 
        ? products.reduce((sum, p) => sum + p.margin, 0) / products.length 
        : 0;
      const riskProducts = products.filter(p => p.margin < 15);
      const starProducts = products.filter(p => p.margin > 40);
      const lowStockProducts = products.filter(p => p.inventory < 10);
      
      let report = '📊 FİNANSAL DURUM RAPORU\n';
      report += '═'.repeat(45) + '\n\n';
      report += `📅 Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}\n`;
      report += `🕐 Oluşturulma: ${new Date().toLocaleTimeString('tr-TR')}\n\n`;
      
      report += '┌─────────────────────────────────────────┐\n';
      report += '│         ÖZET FİNANSAL GÖSTERGELER       │\n';
      report += '├─────────────────────────────────────────┤\n';
      report += `│ Toplam Potansiyel Gelir: ₺${totalRevenue.toLocaleString('tr-TR')}\n`;
      report += `│ Toplam Maliyet:         ₺${totalCost.toLocaleString('tr-TR')}\n`;
      report += `│ Brüt Kâr:              ₺${totalProfit.toLocaleString('tr-TR')}\n`;
      report += `│ Ortalama Kâr Marjı:    %${avgMargin.toFixed(1)}\n`;
      report += `│ Toplam Ürün Sayısı:    ${products.length}\n`;
      report += '└─────────────────────────────────────────┘\n\n';
      
      report += '⭐ YILDIZ ÜRÜNLER (Marj > %40):\n';
      if (starProducts.length > 0) {
        starProducts.forEach(p => {
          report += `   • ${p.name} → Marj: %${p.margin.toFixed(1)}, Stok: ${p.inventory}\n`;
        });
      } else {
        report += '   Yüksek marjlı ürün bulunamadı.\n';
      }
      
      report += '\n⚠️ RİSK ALTINDAKİ ÜRÜNLER (Marj < %15):\n';
      if (riskProducts.length > 0) {
        riskProducts.forEach(p => {
          report += `   • ${p.name} → Marj: %${p.margin.toFixed(1)}, Fiyat: ₺${p.price}\n`;
        });
      } else {
        report += '   Risk altında ürün yok - harika!\n';
      }
      
      report += '\n📦 STOK UYARILARI (Stok < 10):\n';
      if (lowStockProducts.length > 0) {
        lowStockProducts.forEach(p => {
          report += `   • ${p.name} → Stok: ${p.inventory} adet (ACİL SİPARİŞ)\n`;
        });
      } else {
        report += '   Tüm ürün stokları yeterli seviyede.\n';
      }
      
      report += '\n\n📋 ÜRÜN BAZLI DETAY:\n';
      report += '━'.repeat(45) + '\n';
      products.forEach((p, i) => {
        const profitPerUnit = p.price - p.costPrice;
        const totalProfitProduct = profitPerUnit * p.inventory;
        report += `${i + 1}. ${p.name}\n`;
        report += `   Satış: ₺${p.price} | Maliyet: ₺${p.costPrice} | Birim Kâr: ₺${profitPerUnit.toFixed(0)}\n`;
        report += `   Stok: ${p.inventory} | Toplam Kâr Potansiyeli: ₺${totalProfitProduct.toLocaleString('tr-TR')}\n`;
        report += `   Marj: %${p.margin.toFixed(1)} | Rakip Fiyat: ₺${p.competitors || 'N/A'}\n\n`;
      });
      
      report += '━'.repeat(45) + '\n';
      report += '\n🎯 STRATEJİK ÖNERİLER:\n';
      report += '1. Risk altındaki ürünlerde fiyat revizyonu yapılmalı\n';
      report += '2. Yıldız ürünlerin stokları artırılmalı\n';
      report += '3. Düşük stoklu ürünler için acil tedarik planlanmalı\n';
      report += '4. Rakip fiyatları haftalık kontrol edilmeli\n';
      report += '5. Kâr marjı %20 altındaki ürünlerde kampanya düzenlenebilir\n';
      
      setReportTitle('📊 Finansal Durum Raporu');
      setReportContent(report);
      setReportModalOpen(true);
    } catch (error) {
      alert(`❌ Hata: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // Basit HTML-to-print PDF yöntemi
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 40px; line-height: 1.6; color: #1a1a1a; }
            h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
            pre { white-space: pre-wrap; word-wrap: break-word; font-size: 13px; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>${reportTitle}</h1>
          <pre>${reportContent}</pre>
          <div class="footer">AI Commerce Agent - KOBİ Otonom Asistan | ${new Date().toLocaleDateString('tr-TR')}</div>
          <script>setTimeout(() => { window.print(); }, 500);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      {/* Report Modal */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setReportModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden border border-gray-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'fadeInReport 0.3s ease-out' }}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{reportTitle}</h3>
                <button onClick={() => setReportModalOpen(false)} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
              </div>
            </div>
            {/* Modal Body */}
            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-slate-900">
              <pre className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap font-mono leading-relaxed">{reportContent}</pre>
            </div>
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Commerce Agent tarafından oluşturuldu</p>
              <div className="flex gap-3">
                <button onClick={handleDownloadPDF} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm">
                  📥 PDF İndir
                </button>
                <button onClick={() => setReportModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm">
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeInReport {
          from { opacity: 0; transform: scale(0.93) translateY(15px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ürün Yönetimi</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">AI Agent tarafından optimize edilen ürünler</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all font-semibold text-sm"
          >
            {showAddForm ? '✕ Formu Kapat' : '+ Yeni Ürün Ekle'}
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="card border-2 border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-800">
            <h3 className="card-header border-b border-gray-100 dark:border-slate-700 pb-3">Yeni Ürün Ekle</h3>

            <form className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ürün Adı</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Örn: Wireless Headphones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition-colors">
                  <option>Elektronik</option>
                  <option>Aksesuar</option>
                  <option>Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maliyet (₺)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Başlangıç Fiyatı (₺)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="450"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stok</label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Açıklama</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ürün açıklaması..."
                  rows={3}
                />
              </div>

              <div className="col-span-2 flex gap-4 mt-2">
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex-1 transition">
                  Ürün Ekle
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 btn-secondary rounded-xl font-semibold flex-1 transition"
                  onClick={() => setShowAddForm(false)}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="card">
          <div className="card-header border-b border-gray-100 dark:border-slate-700 pb-3">Ürün Listesi ({products.length})</div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 dark:border-slate-700">
                <tr className="text-gray-500 dark:text-gray-400">
                  <th className="text-left py-3.5 px-4 font-semibold">Ürün Adı</th>
                  <th className="text-right py-3.5 px-4 font-semibold">Fiyat</th>
                  <th className="text-right py-3.5 px-4 font-semibold">Rakipler</th>
                  <th className="text-right py-3.5 px-4 font-semibold">Kar %</th>
                  <th className="text-right py-3.5 px-4 font-semibold">Stok</th>
                  <th className="text-left py-3.5 px-4 font-semibold">Agent Önerisi</th>
                  <th className="text-center py-3.5 px-4 font-semibold">İşlemler</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-750/30 transition duration-150">
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-200">{product.name}</td>

                    <td className="text-right py-4 px-4">
                      <span className="font-bold text-gray-900 dark:text-white">₺{product.price}</span>
                    </td>

                    <td className="text-right py-4 px-4 text-gray-600 dark:text-gray-400 font-medium">₺{product.competitors}</td>

                    <td className="text-right py-4 px-4 font-semibold">
                      <span
                        className={
                          product.margin < 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : product.margin > 40 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-blue-600 dark:text-blue-400'
                        }
                      >
                        {product.margin.toFixed(1)}%
                      </span>
                    </td>

                    <td className="text-right py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          product.inventory < 5
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300'
                            : product.inventory < 20
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300'
                        }`}
                      >
                        {product.inventory}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{product.recommendation}</span>
                        <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded font-bold">
                          {(product.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>

                    <td className="text-center py-4 px-4">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="text-blue-600 dark:text-blue-450 hover:text-blue-700 dark:hover:text-blue-350 font-bold text-sm bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-lg transition"
                      >
                        Düzenle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="card bg-blue-50/50 dark:bg-slate-800/50 border border-blue-200 dark:border-slate-700">
          <h3 className="card-header text-blue-900 dark:text-blue-400">🤖 Toplu Agent İşlemleri</h3>

          <div className="grid grid-cols-3 gap-6 mt-4">
            <button 
              onClick={handleBulkOptimize}
              disabled={loading}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition disabled:opacity-50"
            >
              {loading ? '⏳ Optimize Ediliyor...' : 'Tümünü Optimize Et'}
            </button>
            <button 
              onClick={handleBulkImproveDescriptions}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition"
            >
              Açıklamaları İyileştir
            </button>
            <button 
              onClick={handleGenerateFinancialReport}
              className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition"
            >
              Finansal Rapor Oluştur
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-100 dark:border-slate-700"
              style={{ animation: 'fadeInReport 0.25s ease-out' }}>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ürün Düzenle</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ürün Adı</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fiyat (₺)</label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maliyet (₺)</label>
                  <input
                    type="number"
                    value={editFormData.costPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, costPrice: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stok</label>
                  <input
                    type="number"
                    value={editFormData.inventory}
                    onChange={(e) => setEditFormData({ ...editFormData, inventory: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-650 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleEditSave}
                  disabled={loading}
                  className="flex-1 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/10 hover:shadow-xl transition disabled:opacity-50"
                >
                  {loading ? '⏳ Kaydediliyor...' : '✓ Kaydet'}
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  disabled={loading}
                  className="flex-1 px-5 py-2.5 btn-secondary rounded-xl font-bold transition"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
