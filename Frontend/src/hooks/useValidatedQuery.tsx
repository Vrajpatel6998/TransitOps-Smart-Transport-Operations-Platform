import { useState, useCallback } from 'react';

export function useValidatedQuery<T, E = string>(
  queryFn: (...args: any[]) => Promise<T>,
  validateFn?: (data: T) => boolean
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryFn(...args);
      if (validateFn && !validateFn(result)) {
        throw new Error('Query data failed validation criteria');
      }
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error occurred executing query');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [queryFn, validateFn]);

  return { data, error, loading, execute };
}
