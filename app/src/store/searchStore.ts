import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SearchState {
  recentQueries: string[];
  pushQuery: (q: string) => void;
  clearQueries: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentQueries: [],
      pushQuery: (q) =>
        set((s) => {
          const trimmed = q.trim();
          if (!trimmed) return s;
          const filtered = s.recentQueries.filter((r) => r.toLowerCase() !== trimmed.toLowerCase());
          return { recentQueries: [trimmed, ...filtered].slice(0, 15) };
        }),
      clearQueries: () => set({ recentQueries: [] }),
    }),
    {
      name: 'ytplayer-search',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
