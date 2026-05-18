'use client';

import { useState, useEffect } from 'react';

export default function PriceSimulator() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [priceChange, setPriceChange] = useState(0); // yüzde olarak
  const [stockChange, setStockChange] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const result = await res.json();
        if (result.success && result.data?.data) {
          const mapped = result.data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.current_price) || parseFloat(p.base_price) || 0,
            cost: parseFloat(p.cost_price) || 0,
            stock: parseInt(p.inventory) || 0,
          }));
          setProducts(mapped);
          if (mapped.length > 0) setSelectedProduct(mapped[0]);
        }
      } catch (e) {
        console.error('Simülatör: Ürünler yüklenemedi', e);
      }
    };
    fetchProducts();
  }, []);

  if (!selectedProduct) return null;

  const currentPrice = selectedProduct.price;
  const cost = selectedProduct.cost;
  const currentStock = selectedProduct.stock;

  const newPrice = currentPrice * (1 + priceChange / 100);
  const newStock = Math.max(0, currentStock + stockChange);

  const currentMargin = currentPrice > 0 ? ((currentPrice - cost) / currentPrice) * 100 : 0;
  const newMargin = newPrice > 0 ? ((newPrice - cost) / newPrice) * 100 : 0;

  const currentTotalProfit = (currentPrice - cost) * currentStock;
  const newTotalProfit = (newPrice - cost) * newStock;

  const profitDiff = newTotalProfit - currentTotalProfit;

  return (
    <>
      {/* Simülasyon sidebar'a link olarak eklenecek, burada modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-xl w-full mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'simFadeIn 0.3s ease-out' }}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">🔮 Ne Olurdu? Simülasyonu</h3>
                <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white text-2xl">&times;</button>
              </div>
              <p className="text-white/70 text-xs mt-1">Fiyat ve stok değişikliklerinin kâr etkisini anlık görün</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Ürün Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ürün Seçin</label>
                <select
                  value={selectedProduct?.id || ''}
                  onChange={(e) => {
                    const p = products.find(pr => pr.id === Number(e.target.value) || pr.id === e.target.value);
                    if (p) { setSelectedProduct(p); setPriceChange(0); setStockChange(0); }
                  }}
                  className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — ₺{p.price}</option>
                  ))}
                </select>
              </div>

              {/* Fiyat Slider */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Fiyat Değişimi</span>
                  <span className={`font-bold ${priceChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange}% → ₺{newPrice.toFixed(0)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={priceChange}
                  onChange={(e) => setPriceChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                  <span>-50%</span><span>0%</span><span>+50%</span>
                </div>
              </div>

              {/* Stok Slider */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Stok Değişimi</span>
                  <span className={`font-bold ${stockChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stockChange >= 0 ? '+' : ''}{stockChange} adet → {newStock} adet
                  </span>
                </div>
                <input
                  type="range"
                  min={-currentStock}
                  max="200"
                  value={stockChange}
                  onChange={(e) => setStockChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Sonuç Karşılaştırma */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-900/40 rounded-xl border border-gray-200 dark:border-slate-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 tracking-wider">ŞİMDİKİ DURUM</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Fiyat: <b className="text-gray-900 dark:text-white">₺{currentPrice.toFixed(0)}</b></p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Marj: <b className="text-gray-900 dark:text-white">%{(currentMargin || 0).toFixed(1)}</b></p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Stok: <b className="text-gray-900 dark:text-white">{currentStock}</b></p>
                  <p className="text-sm mt-2 font-bold text-gray-800 dark:text-gray-200 border-t border-gray-150 dark:border-slate-800 pt-2">
                    Toplam Kâr: <span className="text-blue-600 dark:text-blue-400">₺{currentTotalProfit.toLocaleString('tr-TR')}</span>
                  </p>
                </div>
                
                <div className={`p-4 rounded-xl border transition-colors ${
                  profitDiff >= 0 
                    ? 'bg-green-50 dark:bg-emerald-950/20 border-green-200 dark:border-emerald-800/40' 
                    : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40'
                }`}>
                  <p className={`text-xs font-semibold mb-2 tracking-wider ${profitDiff >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    SİMÜLASYON SONUCU
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Fiyat: <b className="text-gray-900 dark:text-white">₺{newPrice.toFixed(0)}</b></p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Marj: <b className="text-gray-900 dark:text-white">%{(newMargin || 0).toFixed(1)}</b></p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Stok: <b className="text-gray-900 dark:text-white">{newStock}</b></p>
                  <p className={`text-sm mt-2 font-bold border-t ${
                    profitDiff >= 0 
                      ? 'text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-900/30' 
                      : 'text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-900/30'
                  } pt-2`}>
                    Toplam Kâr: ₺{newTotalProfit.toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>

              {/* Fark Göstergesi */}
              <div className={`text-center p-3.5 rounded-xl border transition-colors ${
                profitDiff >= 0 
                  ? 'bg-green-50 dark:bg-emerald-950/25 border-green-200 dark:border-emerald-800/30' 
                  : 'bg-red-50 dark:bg-red-950/25 border-red-200 dark:border-red-900/30'
              }`}>
                <span className={`text-lg font-extrabold ${profitDiff >= 0 ? 'text-green-700 dark:text-green-450' : 'text-red-700 dark:text-red-450'}`}>
                  {profitDiff >= 0 ? '📈' : '📉'} Kâr Farkı: {profitDiff >= 0 ? '+' : ''}₺{profitDiff.toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar'dan açılacak şekilde export */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition w-full text-left"
      >
        🔮 Simülasyon
      </button>

      <style jsx>{`
        @keyframes simFadeIn {
          from { opacity: 0; transform: scale(0.93) translateY(15px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
