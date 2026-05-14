'use client';

import { useState } from 'react';

export default function AgentStartButton() {
  const [loading, setLoading] = useState(false);

  const handleStartAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ANALYZE_MARKET' }),
      });
      const data = await response.json();
      
      const analysisText = data.response?.analysis || data.analysis || 'Tüm ürünler ve pazar koşulları başarıyla analiz edildi.';
      alert(`✅ Agentic Analiz Tamamlandı!\n\n${analysisText}`);
    } catch (error) {
      alert(`❌ Analiz sırasında hata oluştu: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleStartAnalysis}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
    >
      {loading ? '⏳ Analiz Ediliyor...' : '🚀 Agentic Analiz Başlat'}
    </button>
  );
}
