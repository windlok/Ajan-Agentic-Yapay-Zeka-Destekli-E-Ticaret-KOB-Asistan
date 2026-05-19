# 🤖 AI Commerce Agent - KOBİ Otonom Asistan

**Hackathon 26 Katılımı** | E-ticaret & Finans Odaklı Agentic AI Çözümü

🚀 **[Canlı Demo Linki]([https://ai-commerce-agent.vercel.app](https://ajan-agentic-yapay-zeka-destekli-e-rosy.vercel.app))()** 
https://ajan-agentic-yapay-zeka-destekli-e-rosy.vercel.app

## 📋 Proje Tanımı

E-ticaret satıcılarının ürün fiyatlarını **otomatik olarak** pazar ve rakip analizine göre güncelleyen, kâr/zarar durumunu hesaplayan ve müşteri geri bildirimlerine göre ürün açıklamalarını optimize eden **otonom yapay zeka asistanı**.

### ✨ Temel Özellikler

- 🔍 **Rakip Analizi**: Otomatik fiyat karşılaştırması ve pazar analizi
- 💰 **Finansal Durum**: Gerçek zamanlı kâr/zarar hesaplaması
- 📝 **Ürün Optimizasyonu**: AI-tabanlı ürün açıklaması iyileştirmesi
- 🧠 **Agentic AI**: Gemini API ile otonom karar alma
- 🎨 **Kullanıcı Dostu UI**: İşletme sahibi için sade ve işlevsel arayüz

## 🛠 Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | Next.js 14 + React + TypeScript + Tailwind CSS |
| **Backend** | Next.js API Routes + Node.js |
| **Database** | PostgreSQL (Vercel Postgres) |
| **AI Engine** | Google Gemini API |

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── agent/             # Agentic AI endpoints
│   │   ├── products/          # Ürün yönetimi
│   │   └── financial/         # Finansal veriler
│   └── (pages)/               # Frontend sayfaları
│       ├── dashboard/         # Ana pano
│       ├── products/          # Ürün yönetimi UI
│       └── financial/         # Finansal durum UI
├── components/                 # React bileşenleri
├── lib/                        # Yardımcı kütüphaneler
└── types/                      # TypeScript tipleri
```

## 🚀 Hızlı Başlangıç

```bash
# 1. Dependency'leri yükle
npm install

# 2. Environment variables'ı yapılandır
cp .env.example .env.local

# 3. Development sunucusunu çalıştır
npm run dev
```

Tarayıcı: `http://localhost:3000`

## 📝 Code Standards

- **Naming**: camelCase (functions), PascalCase (components)
- **Formatting**: Prettier
- **Type Safety**: TypeScript strict mode

## 📦 Deployment

Vercel, Railway veya Render üzerinde deploy edilebilir.

---

**Last Updated**: May 2026 | **Hackathon 26**
