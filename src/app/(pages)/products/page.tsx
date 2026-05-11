'use client';

/**
 * Products Management Page
 * Manage products, view agent recommendations, and optimize pricing
 */

import { useState, useEffect } from 'react';

interface Product {
  id?: number;
  name: string;
  description?: string;
  base_price: number;
  current_price: number;
  cost_price: number;
  category?: string;
  inventory: number;
  competitor_prices?: Record<string, number>;
}

export default function ProductsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success && data.data.data) {
          setProducts(data.data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle add product
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          category: formData.get('category'),
          costPrice: parseFloat(formData.get('costPrice') as string),
          basePrice: parseFloat(formData.get('basePrice') as string),
          currentPrice: parseFloat(formData.get('basePrice') as string),
          inventory: parseInt(formData.get('inventory') as string),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProducts([...products, data.data]);
          setShowAddForm(false);
          (e.target as HTMLFormElement).reset();
        }
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Calculate margin
  const calculateMargin = (currentPrice: number, costPrice: number) => {
    return ((currentPrice - costPrice) / currentPrice) * 100;
  };

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

          <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Örn: Wireless Headphones"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select name="category" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                <option>Elektronik</option>
                <option>Aksesuar</option>
                <option>Diğer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maliyet (₺)</label>
              <input
                type="number"
                name="costPrice"
                required
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Fiyatı (₺)</label>
              <input
                type="number"
                name="basePrice"
                required
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="450"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
              <input
                type="number"
                name="inventory"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <textarea
                name="description"
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
        <div className="card-header">Ürün Listesi ({products.length})</div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">
            ⏳ Ürünler yükleniyor...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            📦 Henüz ürün eklenmedi
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-gray-200">
                <tr className="text-gray-600">
                  <th className="text-left py-3 px-4">Ürün Adı</th>
                  <th className="text-right py-3 px-4">Fiyat</th>
                  <th className="text-right py-3 px-4">Maliyet</th>
                  <th className="text-right py-3 px-4">Kar %</th>
                  <th className="text-right py-3 px-4">Stok</th>
                  <th className="text-center py-3 px-4">İşlemler</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {products.map((product) => {
                  const margin = calculateMargin(product.current_price, product.cost_price);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-4 font-medium">{product.name}</td>

                      <td className="text-right py-4 px-4">
                        <span className="font-semibold">₺{product.current_price?.toFixed(2)}</span>
                      </td>

                      <td className="text-right py-4 px-4 text-gray-600">₺{product.cost_price?.toFixed(2)}</td>

                      <td className="text-right py-4 px-4">
                        <span
                          className={`font-semibold ${
                            margin < 0 ? 'text-red-600' : margin > 50 ? 'text-green-600' : 'text-blue-600'
                          }`}
                        >
                          {margin.toFixed(1)}%
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

                      <td className="text-center py-4 px-4">
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Düzenle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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
