'use client';

/**
 * Products Management Page
 * Manage products, view agent recommendations, and optimize pricing
 */

import { useState } from 'react';

export default function ProductsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = async (productId: number, productName: string) => {
    const newPrice = prompt(`${productName} için yeni fiyat girin (₺):`, '');
    if (!newPrice) return;

    setLoading(true);
    try {
      const response = await fetch('/api/actions/update-product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          name: productName,
          description: `Updated ${productName}`,
          basePrice: parseInt(newPrice),
          costPrice: 100,
          inventory: 50,
        }),
      });
      const data = await response.json();
      alert(`✅ ${productName} başarıyla güncellendi!\n\nYeni Fiyat: ₺${newPrice}\nKar Marjı: ${data.newMargin}%`);
    } catch (error) {
      alert(`❌ Hata: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const mockProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 450,
      costPrice: 200,
      competitors: 420,
      margin: 44.4,
      inventory: 45,
      recommendation: 'Fiyat düşürün ₺420',
      confidence: 0.92,
    },
    {
      id: 2,
      name: 'USB-C Cable',
      price: 89,
      costPrice: 30,
      competitors: 85,
      margin: 66.3,
      inventory: 120,
      recommendation: 'Fiyat uygun, korunmalı',
      confidence: 0.85,
    },
    {
      id: 3,
      name: 'Phone Stand',
      price: 120,
      costPrice: 60,
      competitors: 150,
      margin: 50,
      inventory: 3,
      recommendation: 'Stok bitme riski',
      confidence: 0.88,
    },
    {
      id: 4,
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-gray-600 mt-2">AI Agent tarafından optimize edilen ürünler</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          + Yeni Ürün Ekle
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="card border-2 border-blue-200">
          <h3 className="card-header">Yeni Ürün Ekle</h3>

          <form className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Örn: Wireless Headphones"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                <option>Elektronik</option>
                <option>Aksesuar</option>
                <option>Diğer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maliyet (₺)</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Fiyatı (₺)</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="450"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Ürün açıklaması..."
                rows={3}
              />
            </div>

            <div className="col-span-2 flex gap-4">
              <button type="submit" className="btn-primary flex-1">
                Ürün Ekle
              </button>
              <button
                type="button"
                className="btn-secondary flex-1"
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
        <div className="card-header">Ürün Listesi ({mockProducts.length})</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-gray-200">
              <tr className="text-gray-600">
                <th className="text-left py-3 px-4">Ürün Adı</th>
                <th className="text-right py-3 px-4">Fiyat</th>
                <th className="text-right py-3 px-4">Rakipler</th>
                <th className="text-right py-3 px-4">Kar %</th>
                <th className="text-right py-3 px-4">Stok</th>
                <th className="text-left py-3 px-4">Agent Önerisi</th>
                <th className="text-center py-3 px-4">İşlemler</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-4 font-medium">{product.name}</td>

                  <td className="text-right py-4 px-4">
                    <span className="font-semibold">₺{product.price}</span>
                  </td>

                  <td className="text-right py-4 px-4 text-gray-600">₺{product.competitors}</td>

                  <td className="text-right py-4 px-4">
                    <span
                      className={`font-semibold ${
                        product.margin < 0 ? 'text-red-600' : product.margin > 50 ? 'text-green-600' : 'text-blue-600'
                      }`}
                    >
                      {product.margin.toFixed(1)}%
                    </span>
                  </td>

                  <td className="text-right py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        product.inventory < 10
                          ? 'bg-red-100 text-red-800'
                          : product.inventory < 50
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {product.inventory}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{product.recommendation}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {(product.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>

                  <td className="text-center py-4 px-4">
                    <button 
                      onClick={() => handleEdit(product.id, product.name)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm">
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
      <div className="card bg-blue-50 border-2 border-blue-200">
        <h3 className="card-header text-blue-900">🤖 Toplu Agent İşlemleri</h3>

        <div className="grid grid-cols-3 gap-4">
          <button className="btn-primary bg-blue-600">
            Tümünü Optimize Et
          </button>
          <button className="btn-primary bg-green-600">
            Açıklamaları Iyileştir
          </button>
          <button className="btn-primary bg-orange-600">
            Finansal Rapor Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}
