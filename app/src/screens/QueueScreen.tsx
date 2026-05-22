import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrackPlayer from 'react-native-track-player';
import { Icon } from '@/components/Icon';
import { TrackRow } from '@/components/TrackRow';
import { colors, layout, radii, spacing, typography } from '@/theme';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { usePlayerStore } from '@/store/playerStore';

export function QueueScreen() {
  const queue = usePlayerStore((s) => s.queue);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);
  const { track: activeTrack, isPlaying, activeIndex } = useNowPlaying();

  const playFromQueue = async (index: number) => {
    try {
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
    } catch {}
  };

  const removeAt = async (index: number) => {
    try {
      await TrackPlayer.remove(index);
    } catch {}
    removeFromQueue(index);
  };

  const clearAll = async () => {
    try {
      await TrackPlayer.reset();
    } catch {}
    clearQueue();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Coda</Text>
        {queue.length > 0 && (
          <Pressable onPress={clearAll} style={styles.clearBtn} hitSlop={8}>
            <Icon name="trash" size={18} color={colors.textMuted} />
            <Text style={styles.clearText}>Pulisci</Text>
          </Pressable>
        )}
      </View>

      {queue.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="queue" size={36} color={colors.textSubtle} />
          <Text style={styles.emptyText}>La coda è vuota</Text>
          <Text style={styles.emptySubtext}>Cerca un brano per iniziare</Text>
        </View>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          renderItem={({ item, index }) => {
            const isActive = activeIndex === index || (!!activeTrack && activeTrack.id === item.id);
            return (
              <TrackRow
                track={item}
                onPress={() => playFromQueue(index)}
                onMore={() => removeAt(index)}
                isActive={isActive}
                isPlaying={isActive && isPlaying}
                index={index}
              />
            );
          }}
          contentContainerStyle={{ paddingBottom: layout.tabBarHeight + layout.miniPlayerHeight + spacing.lg }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  heading: { ...typography.display, color: colors.text },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgCard,
    borderRadius: radii.pill,
  },
  clearText: { ...typography.caption, color: colors.textMuted },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg },
  emptyText: { ...typography.heading, color: colors.text },
  emptySubtext: { ...typography.body, color: colors.textMuted },
});
