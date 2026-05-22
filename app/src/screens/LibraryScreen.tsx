import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { TrackRow } from '@/components/TrackRow';
import { colors, layout, spacing, typography } from '@/theme';
import { usePlayerStore } from '@/store/playerStore';
import { loadQueue } from '@/services/trackPlayer';
import type { TrackSummary } from '@/api/types';

export function LibraryScreen() {
  const recent = usePlayerStore((s) => s.recent);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const pushRecent = usePlayerStore((s) => s.pushRecent);

  const play = async (track: TrackSummary, index: number) => {
    const list = recent.slice(index);
    setQueue(list, 0);
    pushRecent(track);
    await loadQueue(list, 0);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Libreria</Text>
        <Text style={styles.subheading}>I tuoi brani recenti</Text>
      </View>

      {recent.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="library" size={36} color={colors.textSubtle} />
          <Text style={styles.emptyText}>Nessun brano riprodotto</Text>
          <Text style={styles.emptySubtext}>I brani che ascolti appariranno qui</Text>
        </View>
      ) : (
        <FlatList
          data={recent}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          renderItem={({ item, index }) => (
            <TrackRow track={item} onPress={() => play(item, index)} />
          )}
          contentContainerStyle={{ paddingBottom: layout.tabBarHeight + layout.miniPlayerHeight + spacing.lg }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg, gap: spacing.xs },
  heading: { ...typography.display, color: colors.text },
  subheading: { ...typography.body, color: colors.textMuted },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg },
  emptyText: { ...typography.heading, color: colors.text },
  emptySubtext: { ...typography.body, color: colors.textMuted },
});
