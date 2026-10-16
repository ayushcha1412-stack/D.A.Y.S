import { useEffect, useState } from 'react';

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * @param {number} target  - final value
 * @param {number} duration - animation duration in ms
 * @param {boolean} trigger - start the counter when true
 */
export function useCounter(target, duration = 2000, trigger = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return count;
}
