import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchCatalog } from '../services/api';
export function useCatalog() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);
  const latest = useRef(0);
  const refresh = useCallback(async () => {
    const sequence = ++latest.current;
    const started = performance.now();
    try {
      const data = await fetchCatalog();
      if (mounted.current && sequence === latest.current) {
        setCatalog({
          ...data,
          synchronizedAt: performance.now(),
          serverTimestamp: new Date(data.serverTime).getTime() + (performance.now() - started) / 2,
        });
        setError('');
      }
      return data;
    } catch (err) {
      if (mounted.current && sequence === latest.current) setError(err.message);
    } finally {
      if (mounted.current && sequence === latest.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    refresh();
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, 15000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      mounted.current = false;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);
  return { catalog, loading, error, refresh };
}
