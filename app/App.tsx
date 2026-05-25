import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, type Theme } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import TrackPlayer, { Event } from 'react-native-track-player';
import { RootNavigator } from '@/navigation/RootNavigator';
import { colors } from '@/theme';
import { setupPlayer } from '@/services/trackPlayer';
import { usePlayerStore } from '@/store/playerStore';
import type { TrackSummary } from '@/api/types';
import { ErrorBoundary } from '@/components/ErrorBoundary';

try {
  SystemUI.setBackgroundColorAsync(colors.bg).catch(() => {});
} catch {}

const navTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
    notification: colors.accent,
  },
};

export default function App() {
  useEffect(() => {
    setupPlayer().catch((e) => console.warn('[YTPlayer] setupPlayer failed', e));

    const sub = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async (event) => {
      if (event.index == null) return;
      const queue = await TrackPlayer.getQueue();
      const t = queue[event.index];
      if (!t) return;
      const summary: TrackSummary = {
        id: String(t.id ?? ''),
        title: String(t.title ?? ''),
        artist: String(t.artist ?? ''),
        duration: Number(t.duration ?? 0),
        thumbnail: typeof t.artwork === 'string' ? t.artwork : '',
        url: typeof t.url === 'string' ? t.url : '',
      };
      if (summary.id) usePlayerStore.getState().pushRecent(summary);
    });

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <NavigationContainer theme={navTheme}>
            <StatusBar style="light" />
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
