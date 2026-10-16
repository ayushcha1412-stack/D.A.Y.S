import { useState } from 'react';

/**
 * useState but backed by localStorage.
 * @param {string} key  - localStorage key
 * @param {*} initial   - default value
 */
export function useLocalStorage(key, initial) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  });

  const setValue = (value) => {
    try {
      const toStore = value instanceof Function ? value(stored) : value;
      setStored(toStore);
      window.localStorage.setItem(key, JSON.stringify(toStore));
    } catch (err) {
      console.warn('useLocalStorage write error:', err);
    }
  };

  return [stored, setValue];
}
