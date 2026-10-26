import { useEffect, useState } from 'react';
export function usePersistentState(key, fallback, validate = () => true) {
  const [value, setValue] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed !== null && validate(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Browsing still works when storage is unavailable. */
    }
  }, [key, value]);
  return [value, setValue];
}
