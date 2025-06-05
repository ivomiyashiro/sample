import { Outlet } from 'react-router';

import { Toaster } from '@/components/ui/sonner';

export const AppLayout = () => {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <Outlet />
      <Toaster richColors={true} closeButton={true} />
    </main>
  );
};
