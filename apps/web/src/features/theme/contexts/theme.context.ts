import { createContext } from 'react';
import type { ThemeProviderState } from '@/features/theme/types';

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

export const ThemeContextProvider =
  createContext<ThemeProviderState>(initialState);
