# AI Commerce Agent Setup Guide

## 🚀 Hızlı Başlangıç

### 1. Gereksinimler
- Node.js 18+ veya 20+
- npm veya yarn
- Git
- Google Gemini API Key (ücretsiz)

### 2. Repository Klonla
```bash
git clone https://github.com/YOUR_USERNAME/ai-commerce-agent.git
cd ai-commerce-agent
```

### 3. Dependencies'leri Yükle
```bash
npm install
```

### 4. Environment Variables'ı Yapılandır

#### 4.1 .env.local dosyasını oluştur
```bash
cp .env.example .env.local
```

#### 4.2 Gemini API Key al
1. [Google AI Studio](https://aistudio.google.com) ziyaret et
2. "Get API Key" butonuna tıkla
3. "Create API key in new Google Cloud project" seç
4. API Key'i kopyala

#### 4.3 .env.local dosyasını doldur
```
GEMINI_API_KEY=your_copied_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5. Development Sunucusunu Çalıştır
```bash
npm run dev
```

Tarayıcında aç: `http://localhost:3000`

---

## 📁 Proje Yapısı Açıklaması

```
src/
├── app/
│   ├── api/                      # Backend API Routes
│   │   ├── agent/analyze/        # AI Agent analyze endpoint
│   │   ├── products/             # Product management API
│   │   └── financial/            # Financial analysis API
│   ├── (pages)/                  # Frontend pages (grouped routes)
│   │   ├── dashboard/            # Main dashboard
│   │   ├── products/             # Product management UI
│   │   └── financial/            # Financial status UI
│   ├── layout.tsx                # Main layout with sidebar
│   ├── globals.css               # Global styles
│   └── page.tsx                  # Home page
├── lib/
│   ├── agents/agent.ts           # Agentic AI orchestrator
│   ├── gemini/client.ts          # Gemini API integration
│   └── database/                 # Database utilities
├── types/index.ts                # TypeScript type definitions
└── components/                   # Reusable React components
```

---

## 🧠 Agentic AI Nasıl Çalışıyor?

### Agent Actions
1. **OPTIMIZE_PRICE**: Ürün fiyatlarını pazara göre optimize et
2. **ANALYZE_MARKET**: Pazar trendleri ve rakipçi analizini yap
3. **IMPROVE_DESCRIPTION**: Ürün açıklamalarını iyileştir
4. **ASSESS_COMPETITOR**: Rakipleri değerlendir
5. **GENERATE_REPORT**: Finansal rapor oluştur

### System Prompts
Her action için özel sistem promptları tanımlı:
- Price Optimizer: Kar marjı ve pazarlama stratejisi
- Market Analyst: Trend analizi ve fırsat tespiti
- Description Optimizer: SEO ve dönüşüm oranı
- Financial Analyst: Kar/zarar ve ROI

---

## 🔌 API Endpoints

### Agent API
```
POST /api/agent/analyze
```

Request:
```json
{
  "action": "OPTIMIZE_PRICE",
  "productId": "prod-123",
  "data": {
    "product": { ... },
    "competitorPrices": [420, 430, 440],
    "salesHistory": { ... }
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "action": "OPTIMIZE_PRICE",
    "result": {
      "recommendedPrice": 425,
      "expectedProfit": 225,
      "profitMargin": 50
    },
    "confidence": 0.92,
    "appliedChanges": ["Price updated from 450 to 425"]
  }
}
```

### Products API
```
GET /api/products                    # List all products
POST /api/products                   # Create new product
PUT /api/products/[id]               # Update product
DELETE /api/products/[id]            # Delete product
```

### Financial API
```
GET /api/financial/dashboard         # Get financial metrics
POST /api/financial/analyze          # Trigger analysis
```

---

## 📊 Kullanım Örnekleri

### Örnek 1: Fiyat Optimizasyonu

```bash
curl -X POST http://localhost:3000/api/agent/analyze \
  -H "Content-Type: application/json" \
  -H "x-seller-id: seller-001" \
  -d '{
    "action": "OPTIMIZE_PRICE",
    "productId": "prod-123",
    "data": {
      "product": {
        "id": "prod-123",
        "name": "Wireless Headphones",
        "currentPrice": 450,
        "costPrice": 200,
        "basePrice": 400
      },
      "competitorPrices": [420, 430, 440],
      "salesHistory": {
        "dailyAverageUnits": 5,
        "weeklyTrend": 0.15,
        "monthlyGrowth": 0.08
      }
    }
  }'
```

---

## 🛠 Development Commands

```bash
# Dev server (http://localhost:3000)
npm run dev

# Build production
npm run build

# Start production server
npm start

# Format code with Prettier
npm run format

# Lint code
npm run lint

# Type checking
npm run type-check
```

---

## 🔐 Security Best Practices

1. **Environment Variables**: Asla .env.local dosyasını commit etmeyin
2. **API Keys**: Gemini API key'inizi gizli tutun
3. **Rate Limiting**: Production'da API rate limiting ekleyin
4. **Input Validation**: Tüm user inputs'ları validate edin
5. **CORS**: Sadece trusted domains'den requests kabul edin

---

## 📚 Öğrenme Kaynakları

- [Next.js Documentation](https://nextjs.org/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Katkıda Bulunma

1. Feature branch oluştur
2. Değişiklikleri commit et
3. Branch'i push et
4. Pull Request aç

---

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakınız.

---

**Last Updated**: May 2026 | Hackathon 26
