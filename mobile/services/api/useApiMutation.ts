import { useCallback, useRef, useState } from 'react';
import type { ApiError } from './errors';

export interface UseApiMutationResult<TInput, TOutput> {
  mutate: (input: TInput) => Promise<TOutput>;
  isLoading: boolean;
  error: ApiError | null;
}

export function useApiMutation<TInput, TOutput>(
  mutationFn: (input: TInput) => Promise<TOutput>
): UseApiMutationResult<TInput, TOutput> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const isMounted = useRef(true);

  const mutate = useCallback(
    async (input: TInput): Promise<TOutput> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await mutationFn(input);
        return result;
      } catch (err) {
        if (isMounted.current) {
          setError(err as ApiError);
        }
        throw err;
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [mutationFn]
  );

  return { mutate, isLoading, error };
}
