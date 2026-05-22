import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import TrackPlayer from 'react-native-track-player';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from './Icon';
import { colors, layout, radii, spacing, typography } from '@/theme';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import type { RootStackParamList } from '@/navigation/types';

export function MiniPlayer() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { track, isPlaying, isLoading, position, duration } = useNowPlaying();

  if (!track) return null;

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  const togglePlay = () => {
    if (isPlaying) TrackPlayer.pause();
    else TrackPlayer.play();
  };

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable style={styles.bar} onPress={() => nav.navigate('Player')}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.row}>
          {track.artwork ? (
            <Image source={{ uri: String(track.artwork) }} style={styles.artwork} contentFit="cover" />
          ) : (
            <View style={[styles.artwork, styles.artworkFallback]}>
              <Icon name="music" size={18} color={colors.textMuted} />
            </View>
          )}
          <View style={styles.meta}>
            <Text numberOfLines={1} style={styles.title}>
              {track.title}
            </Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {track.artist}
            </Text>
          </View>
          <Pressable
            onPress={togglePlay}
            hitSlop={12}
            style={styles.playBtn}
            disabled={isLoading}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} size={24} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={() => TrackPlayer.skipToNext().catch(() => {})}
            hitSlop={12}
            style={styles.skipBtn}
          >
            <Icon name="skip-next" size={22} color={colors.text} />
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: layout.tabBarHeight,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  bar: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressBar: { height: 2, backgroundColor: colors.bgMuted },
  progressFill: { height: 2, backgroundColor: colors.accent },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.md,
    height: layout.miniPlayerHeight,
  },
  artwork: { width: 44, height: 44, borderRadius: radii.sm, backgroundColor: colors.bgMuted },
  artworkFallback: { alignItems: 'center', justifyContent: 'center' },
  meta: { flex: 1, gap: 1 },
  title: { ...typography.body, color: colors.text },
  subtitle: { ...typography.caption, color: colors.textMuted },
  playBtn: { padding: spacing.xs },
  skipBtn: { padding: spacing.xs, marginLeft: -spacing.xs },
});
