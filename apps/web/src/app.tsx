import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppRouter } from '@/features/router';
import { ThemeProvider } from '@/features/theme/providers';
import { AuthProvider } from '@/features/auth/providers';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <AppRouter />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
