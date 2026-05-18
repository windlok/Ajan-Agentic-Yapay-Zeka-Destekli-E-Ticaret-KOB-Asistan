'use client';

import { useState, useEffect, useRef } from 'react';

interface Notification {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Dışarı tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ürünlerden bildirim üret
  useEffect(() => {
    const generateNotifications = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const result = await res.json();
        if (!result.success || !result.data?.data) return;

        const products = result.data.data;
        const notifs: Notification[] = [];
        const now = new Date();

        products.forEach((p: any) => {
          const price = parseFloat(p.current_price) || parseFloat(p.base_price) || 0;
          const cost = parseFloat(p.cost_price) || 0;
          const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
          const stock = parseInt(p.inventory) || 0;

          if (margin < 0) {
            notifs.push({
              id: `loss-${p.id}`,
              type: 'danger',
              title: '🔴 Zarar Uyarısı',
              message: `${p.name} zararda satılıyor! Marj: %${margin.toFixed(1)}`,
              time: 'Az önce',
              read: false,
            });
          }

          if (stock < 5 && stock > 0) {
            notifs.push({
              id: `stock-${p.id}`,
              type: 'warning',
              title: '📦 Kritik Stok',
              message: `${p.name} stoku ${stock} adete düştü!`,
              time: '2 dk önce',
              read: false,
            });
          }

          if (stock === 0) {
            notifs.push({
              id: `out-${p.id}`,
              type: 'danger',
              title: '🚨 Stok Tükendi',
              message: `${p.name} tamamen tükendi!`,
              time: 'Az önce',
              read: false,
            });
          }

          const competitors = p.competitor_prices || {};
          const compPrices = Object.values(competitors).map(Number).filter(v => v > 0);
          if (compPrices.length > 0) {
            const avgComp = compPrices.reduce((a: number, b: number) => a + b, 0) / compPrices.length;
            if (price > avgComp * 1.2) {
              notifs.push({
                id: `price-${p.id}`,
                type: 'info',
                title: '💰 Fiyat Uyarısı',
                message: `${p.name} rakiplerden %${((price / avgComp - 1) * 100).toFixed(0)} pahalı`,
                time: '5 dk önce',
                read: false,
              });
            }
          }
        });

        // Genel bildirimler
        if (notifs.length === 0) {
          notifs.push({
            id: 'all-good',
            type: 'success',
            title: '✅ Her Şey Yolunda',
            message: 'Tüm ürünler normal parametrelerde çalışıyor.',
            time: 'Az önce',
            read: false,
          });
        }

        setNotifications(notifs);
      } catch (e) {
        console.error('Bildirimler yüklenemedi:', e);
      }
    };

    generateNotifications();
    const interval = setInterval(generateNotifications, 30000); // 30 saniyede bir yenile
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const bgColor: Record<string, string> = {
    danger: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900/50',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50',
    success: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50',
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); }}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden"
          style={{ animation: 'slideDown 0.2s ease-out' }}>
          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 flex justify-between items-center">
            <h4 className="text-white font-bold text-sm">Bildirimler ({notifications.length})</h4>
            <div className="flex gap-2">
              <button onClick={markAllRead} className="text-white/80 hover:text-white text-xs underline">
                Okundu
              </button>
              <button onClick={clearAll} className="text-white/80 hover:text-white text-xs underline">
                Tümünü Sil
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 border-b border-l-4 ${bgColor[n.type]} ${n.read ? 'opacity-60' : ''} hover:opacity-100 transition`}
              >
              <div className="flex justify-between items-start">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{n.title}</p>
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">{n.time}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                      className="text-gray-400 hover:text-red-500 text-sm leading-none transition"
                      title="Bildirimi Sil"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
