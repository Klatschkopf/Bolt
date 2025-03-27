import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

export const lightColors = {
  primary: '#7FD4D2',
  primaryLight: '#E8F6F6',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: {
    primary: '#2C3E50',
    secondary: '#94A3B8',
  },
  border: '#E8F6F6',
  error: '#EF4444',
  chart: {
    primary: '#7FD4D2',
    secondary: '#94A3B8',
    background: '#FFFFFF',
  },
};

export const darkColors = {
  primary: '#7FD4D2',
  primaryLight: '#1E3A3A',
  background: '#1A1A1A',
  surface: '#2D2D2D',
  text: {
    primary: '#FFFFFF',
    secondary: '#A0AEC0',
  },
  border: '#2D3748',
  error: '#EF4444',
  chart: {
    primary: '#7FD4D2',
    secondary: '#A0AEC0',
    background: '#2D2D2D',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme || 'light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
