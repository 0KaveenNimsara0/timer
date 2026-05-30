import { useState, useEffect } from 'react';

export type ThemeColors = {
  background: string;
  text: string;
  button: string;
};

const defaultColors: ThemeColors = {
  background: '#111111',
  text: '#ffffff',
  button: '#222222',
};

export function useTheme() {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);

  useEffect(() => {
    const saved = localStorage.getItem('timer_theme');
    if (saved) {
      try {
        setColors(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load theme', e);
      }
    }
  }, []);

  const updateColors = (newColors: ThemeColors) => {
    setColors(newColors);
    localStorage.setItem('timer_theme', JSON.stringify(newColors));
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', colors.background);
    document.documentElement.style.setProperty('--text-color', colors.text);
    document.documentElement.style.setProperty('--btn-color', colors.button);
  }, [colors]);

  return { colors, updateColors };
}
