import type { QueryClient } from '@tanstack/react-query';

import type { ActionFunction } from 'react-router';
import type { LoaderFunction } from 'react-router';

interface RouteModule {
  default: React.ComponentType;
  clientLoader?: (queryClient: QueryClient) => LoaderFunction;
  clientAction?: (queryClient: QueryClient) => ActionFunction;
}

export const convert =
  (queryClient: QueryClient) =>
  (
    m: unknown,
  ): {
    loader?: LoaderFunction;
    action?: ActionFunction;
    Component: React.ComponentType;
  } => {
    const module = m as Partial<RouteModule>;

    return {
      ...(module.clientLoader && { loader: module.clientLoader(queryClient) }),
      ...(module.clientAction && { action: module.clientAction(queryClient) }),
      Component: module.default ?? (() => null),
    };
  };
