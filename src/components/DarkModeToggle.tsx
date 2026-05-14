'use client';

import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kontrol et
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const newValue = !dark;
    setDark(newValue);
    if (newValue) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      title={dark ? 'Açık Mod' : 'Koyu Mod'}
    >
      <span className="text-xl">{dark ? '☀️' : '🌙'}</span>
    </button>
  );
}
