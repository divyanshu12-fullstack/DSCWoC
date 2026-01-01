import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: true, // Refetch when connection is restored
      refetchOnMount: true, // Refetch on mount if stale
    },
  },
});

/**
 * Provider component to wrap your app with React Query
 */
export const QueryProvider = ({ children }) => {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  );
};

export default queryClient;
