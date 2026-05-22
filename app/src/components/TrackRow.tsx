import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Icon } from './Icon';
import { colors, radii, spacing, typography } from '@/theme';
import { formatDuration } from '@/utils/format';
import type { TrackSummary } from '@/api/types';

interface Props {
  track: TrackSummary;
  onPress: () => void;
  onMore?: () => void;
  isActive?: boolean;
  isPlaying?: boolean;
  index?: number;
}

export function TrackRow({ track, onPress, onMore, isActive, isPlaying, index }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, isActive && styles.active]}
    >
      <View style={styles.artworkWrap}>
        {track.thumbnail ? (
          <Image source={{ uri: track.thumbnail }} style={styles.artwork} contentFit="cover" transition={150} />
        ) : (
          <View style={[styles.artwork, styles.artworkFallback]}>
            <Icon name="music" size={20} color={colors.textMuted} />
          </View>
        )}
        {isActive && (
          <View style={styles.activeBadge}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={14} color={colors.bg} />
          </View>
        )}
      </View>
      <View style={styles.meta}>
        <Text numberOfLines={1} style={[styles.title, isActive && styles.titleActive]}>
          {track.title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {track.artist}
          {track.duration ? `  ·  ${formatDuration(track.duration)}` : ''}
        </Text>
      </View>
      {onMore && (
        <Pressable hitSlop={10} onPress={onMore} style={styles.moreBtn}>
          <Icon name="more" size={20} color={colors.textMuted} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  pressed: { backgroundColor: colors.bgElevated },
  active: { backgroundColor: 'transparent' },
  artworkWrap: { position: 'relative' },
  artwork: { width: 52, height: 52, borderRadius: radii.sm, backgroundColor: colors.bgMuted },
  artworkFallback: { alignItems: 'center', justifyContent: 'center' },
  activeBadge: {
    position: 'absolute',
    inset: 0,
    backgroundColor: colors.overlay,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1, gap: 2 },
  title: { ...typography.body, color: colors.text },
  titleActive: { color: colors.accent },
  subtitle: { ...typography.caption, color: colors.textMuted },
  moreBtn: { padding: spacing.xs },
});
