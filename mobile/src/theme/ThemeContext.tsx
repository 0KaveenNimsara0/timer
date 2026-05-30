import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeColors = {
  background: string;
  text: string;
  button: string;
};

const defaultColors: ThemeColors = {
  background: '#111111',
  text: '#ffffff',
  button: '#222222'
};

type ThemeContextType = {
  colors: ThemeColors;
  updateColors: (c: ThemeColors) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultColors,
  updateColors: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem('timer_theme');
        if (saved) {
          setColors(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      }
    };
    loadTheme();
  }, []);

  const updateColors = (newColors: ThemeColors) => {
    setColors(newColors);
    AsyncStorage.setItem('timer_theme', JSON.stringify(newColors)).catch(e => console.error(e));
  };

  return (
    <ThemeContext.Provider value={{ colors, updateColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
