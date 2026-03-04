"use client";

import { useCallback, useSyncExternalStore } from "react";

// Stable reference keeper
let lastKey: string | null = null;
let lastValue: string | null = null;
let lastParsed: number[] = [];

function getStoredProgressSnapshot(key: string): number[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(`progress:${key}`);
  
  // Return cached result if nothing changed to avoid useSyncExternalStore loops
  if (key === lastKey && stored === lastValue) {
    return lastParsed;
  }
  
  lastKey = key;
  lastValue = stored;
  
  if (!stored) {
    lastParsed = [];
  } else {
    try {
      lastParsed = JSON.parse(stored);
    } catch {
      lastParsed = [];
    }
  }
  return lastParsed;
}

export function useProgress(key: string, total: number) {
  const completed = useSyncExternalStore(
    useCallback(
      (callback: () => void) => {
        const handler = (e: StorageEvent) => {
          if (e.key === `progress:${key}`) callback();
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
      },
      [key]
    ),
    () => getStoredProgressSnapshot(key),
    () => [] as number[]
  );

  const toggle = useCallback(
    (id: number) => {
      const current = getStoredProgressSnapshot(key);
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      localStorage.setItem(`progress:${key}`, JSON.stringify(next));
      
      // Dispatch storage event manually for same-tab updates
      window.dispatchEvent(new StorageEvent('storage', { key: `progress:${key}` }));
    },
    [key]
  );

  const reset = useCallback(() => {
    localStorage.removeItem(`progress:${key}`);
    window.dispatchEvent(new StorageEvent('storage', { key: `progress:${key}` }));
  }, [key]);

  return { completed, toggle, reset, total };
}
