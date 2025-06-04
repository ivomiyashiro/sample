import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router';

import { AppLayout } from '@/components/layouts';
import { AppFallback } from '@/components/ui';

import { convert } from './utils';
import { ProtectedRoute, PublicRoute } from './components';

const createAppRouter = (queryClient: QueryClient) => {
  return createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      hydrateFallbackElement: <AppFallback />,
      children: [
        {
          path: '',
          element: <PublicRoute redirectIfAuthenticated={false} />,
          children: [
            {
              index: true,
              lazy: () =>
                import('@/features/landing/landing.page').then(
                  convert(queryClient),
                ),
            },
          ],
        },
        {
          path: '',
          element: <PublicRoute redirectIfAuthenticated={true} />,
          children: [
            {
              path: 'signin',
              lazy: () =>
                import('@/features/auth/pages/signin.page').then(
                  convert(queryClient),
                ),
            },
            {
              path: 'signup',
              lazy: () =>
                import('@/features/auth/pages/signup.page').then(
                  convert(queryClient),
                ),
            },
          ],
        },
        {
          path: '',
          element: <ProtectedRoute />,
          children: [
            {
              path: 'samples',
              lazy: () =>
                import('@/features/samples/pages/sample.page').then(
                  convert(queryClient),
                ),
            },
            {
              path: 'samples/create',
              lazy: () =>
                import('@/features/samples/pages/create-sample.page').then(
                  convert(queryClient),
                ),
            },
          ],
        },
      ],
    },
  ]);
};

export const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = createAppRouter(queryClient);

  return <RouterProvider router={router} />;
};
