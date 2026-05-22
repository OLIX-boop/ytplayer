import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/api/client';
import type { TrackSummary } from '@/api/types';
import { Icon } from '@/components/Icon';
import { TrackRow } from '@/components/TrackRow';
import { colors, layout, radii, spacing, typography } from '@/theme';
import { usePlayerStore } from '@/store/playerStore';
import { useSearchStore } from '@/store/searchStore';
import { loadQueue, appendToQueue } from '@/services/trackPlayer';

export function SearchScreen() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<TrackSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  const recentQueries = useSearchStore((s) => s.recentQueries);
  const pushQuery = useSearchStore((s) => s.pushQuery);
  const clearQueries = useSearchStore((s) => s.clearQueries);

  const setQueue = usePlayerStore((s) => s.setQueue);
  const pushRecent = usePlayerStore((s) => s.pushRecent);

  const runSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      Keyboard.dismiss();
      const id = ++reqId.current;
      setLoading(true);
      setError(null);
      try {
        const res = await api.search(trimmed);
        if (id !== reqId.current) return;
        setResults(res.tracks);
        pushQuery(trimmed);
      } catch (e) {
        if (id !== reqId.current) return;
        setError((e as Error).message || 'Errore di ricerca');
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    },
    [pushQuery]
  );

  const playTrack = async (index: number) => {
    const list = results.slice(index).concat(results.slice(0, index));
    setQueue(list, 0);
    pushRecent(list[0]);
    await loadQueue(list, 0);
  };

  const addToQueueAction = async (track: TrackSummary) => {
    usePlayerStore.getState().addToQueue(track);
    await appendToQueue(track);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Cerca</Text>
        <View style={styles.searchBox}>
          <Icon name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            onSubmitEditing={() => runSearch(q)}
            placeholder="Brani, artisti, album..."
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {q.length > 0 && (
            <Pressable
              onPress={() => {
                setQ('');
                setResults([]);
              }}
              hitSlop={8}
            >
              <Icon name="close" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={() => runSearch(q)} style={styles.retry}>
            <Text style={styles.retryText}>Riprova</Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && results.length === 0 && (
        <FlatList
          data={recentQueries}
          keyExtractor={(item) => item}
          ListHeaderComponent={
            recentQueries.length > 0 ? (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ricerche recenti</Text>
                <Pressable onPress={clearQueries} hitSlop={8}>
                  <Text style={styles.sectionAction}>Pulisci</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.empty}>
                <Icon name="search" size={36} color={colors.textSubtle} />
                <Text style={styles.emptyText}>Cerca qualcosa per iniziare</Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.recentRow, pressed && { backgroundColor: colors.bgElevated }]}
              onPress={() => {
                setQ(item);
                runSearch(item);
              }}
            >
              <Icon name="search" size={16} color={colors.textMuted} />
              <Text style={styles.recentText}>{item}</Text>
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: layout.tabBarHeight + layout.miniPlayerHeight + spacing.lg }}
        />
      )}

      {!loading && !error && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TrackRow
              track={item}
              onPress={() => playTrack(index)}
              onMore={() => addToQueueAction(item)}
            />
          )}
          contentContainerStyle={{ paddingBottom: layout.tabBarHeight + layout.miniPlayerHeight + spacing.lg }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg, gap: spacing.md },
  heading: { ...typography.display, color: colors.text },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  input: { flex: 1, ...typography.body, color: colors.text, padding: 0 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
  empty: { alignItems: 'center', paddingVertical: 64, gap: spacing.md },
  emptyText: { ...typography.body, color: colors.textMuted },
  error: { ...typography.body, color: colors.danger, textAlign: 'center' },
  retry: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgCard,
    borderRadius: radii.pill,
  },
  retryText: { ...typography.body, color: colors.text },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  sectionTitle: { ...typography.caption, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 },
  sectionAction: { ...typography.caption, color: colors.accent },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  recentText: { ...typography.body, color: colors.text },
});
