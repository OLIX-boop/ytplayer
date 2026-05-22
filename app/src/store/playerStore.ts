import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { TrackSummary } from '@/api/types';

export type RepeatMode = 'off' | 'queue' | 'track';

interface PlayerState {
  queue: TrackSummary[];
  currentIndex: number;
  shuffle: boolean;
  repeat: RepeatMode;
  recent: TrackSummary[];

  setQueue: (tracks: TrackSummary[], startIndex?: number) => void;
  setCurrentIndex: (i: number) => void;
  addToQueue: (track: TrackSummary) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  pushRecent: (track: TrackSummary) => void;
}

const REPEAT_CYCLE: RepeatMode[] = ['off', 'queue', 'track'];

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      queue: [],
      currentIndex: -1,
      shuffle: false,
      repeat: 'off',
      recent: [],

      setQueue: (tracks, startIndex = 0) =>
        set({ queue: tracks, currentIndex: tracks.length ? startIndex : -1 }),

      setCurrentIndex: (i) => set({ currentIndex: i }),

      addToQueue: (track) => set((s) => ({ queue: [...s.queue, track] })),

      removeFromQueue: (index) =>
        set((s) => {
          const queue = s.queue.filter((_, i) => i !== index);
          let currentIndex = s.currentIndex;
          if (index < s.currentIndex) currentIndex -= 1;
          else if (index === s.currentIndex) currentIndex = Math.min(currentIndex, queue.length - 1);
          return { queue, currentIndex };
        }),

      clearQueue: () => set({ queue: [], currentIndex: -1 }),

      toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

      cycleRepeat: () => {
        const current = get().repeat;
        const next = REPEAT_CYCLE[(REPEAT_CYCLE.indexOf(current) + 1) % REPEAT_CYCLE.length];
        set({ repeat: next });
      },

      pushRecent: (track) =>
        set((s) => {
          const filtered = s.recent.filter((t) => t.id !== track.id);
          return { recent: [track, ...filtered].slice(0, 30) };
        }),
    }),
    {
      name: 'ytplayer-player',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        shuffle: s.shuffle,
        repeat: s.repeat,
        recent: s.recent,
      }),
    }
  )
);
