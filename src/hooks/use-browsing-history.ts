'use client';

import { useCallback } from 'react';
import useLocalStorage from './use-local-storage';

const MAX_HISTORY_LENGTH = 20;

export function useBrowsingHistory() {
  const [history, setHistory] = useLocalStorage<string[]>('browsing-history', []);

  const addProductToHistory = useCallback(
    (productId: string) => {
      setHistory((prevHistory) => {
        const newHistory = [productId, ...prevHistory.filter((id) => id !== productId)];
        return newHistory.slice(0, MAX_HISTORY_LENGTH);
      });
    },
    [setHistory]
  );

  return { browsingHistory: history, addProductToHistory };
}
