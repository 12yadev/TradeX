import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../services/api';

// Loads data with loading/error state. Re-runs when `deps` change.
// Pass `interval` (ms) to refresh quietly in the background.
export default function useFetch(fetcher, deps = [], interval = 0) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setData(await fetcher());
      setError('');
    } catch (err) {
      if (!silent) setError(getErrorMessage(err));
    } finally {
      if (!silent) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load(false);
    if (!interval) return undefined;
    const id = setInterval(() => load(true), interval);
    return () => clearInterval(id);
  }, [load, interval]);

  return { data, loading, error, reload: () => load(false) };
}
