import { QueryClient } from "@tanstack/react-query";

const MAX_RETRIES = 3;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status = error && typeof error === "object" && "status" in error
          ? (error as { status?: number }).status
          : undefined;
        if (status && [401, 403, 404].includes(status)) return false;
        return failureCount < MAX_RETRIES;
      },
      throwOnError: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});