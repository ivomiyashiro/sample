import { useContext } from 'react';

import { ThemeContextProvider } from '@/features/theme/contexts';

export const useTheme = () => {
  const context = useContext(ThemeContextProvider);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
