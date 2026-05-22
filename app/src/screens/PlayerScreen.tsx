import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import TrackPlayer from 'react-native-track-player';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, radii, spacing, typography } from '@/theme';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { usePlayerStore } from '@/store/playerStore';
import { applyRepeatMode, applyShuffle } from '@/services/trackPlayer';
import { formatDuration } from '@/utils/format';

export function PlayerScreen() {
  const nav = useNavigation();
  const { track, isPlaying, isLoading, position, duration } = useNowPlaying();
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);
  const queue = usePlayerStore((s) => s.queue);

  useEffect(() => {
    applyRepeatMode(repeat).catch(() => {});
  }, [repeat]);

  if (!track) {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable style={styles.closeBtn} onPress={() => nav.goBack()}>
          <Icon name="chevron-down" size={28} color={colors.text} />
        </Pressable>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nessun brano in riproduzione</Text>
        </View>
      </SafeAreaView>
    );
  }

  const togglePlay = () => {
    if (isPlaying) TrackPlayer.pause();
    else TrackPlayer.play();
  };

  const onShuffle = () => {
    const next = !shuffle;
    toggleShuffle();
    applyShuffle(next, queue).catch(() => {});
  };

  const onRepeat = () => {
    cycleRepeat();
  };

  const artworkUri = track.artwork ? String(track.artwork) : undefined;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.bgElevated, colors.bg]}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable onPress={() => nav.goBack()} hitSlop={12} style={styles.iconBtn}>
            <Icon name="chevron-down" size={26} color={colors.text} />
          </Pressable>
          <View style={styles.topTitleWrap}>
            <Text style={styles.topLabel}>IN RIPRODUZIONE</Text>
          </View>
          <Pressable hitSlop={12} style={styles.iconBtn}>
            <Icon name="more" size={22} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.artworkSection}>
          {artworkUri ? (
            <Image source={{ uri: artworkUri }} style={styles.artwork} contentFit="cover" transition={250} />
          ) : (
            <View style={[styles.artwork, styles.artworkFallback]}>
              <Icon name="music" size={64} color={colors.textMuted} />
            </View>
          )}
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {track.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {track.artist}
            </Text>
          </View>

          <View style={styles.progressWrap}>
            <ProgressBar
              position={position}
              duration={duration}
              onSeek={(s) => TrackPlayer.seekTo(s)}
            />
            <View style={styles.timesRow}>
              <Text style={styles.time}>{formatDuration(position)}</Text>
              <Text style={styles.time}>{formatDuration(duration)}</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <Pressable onPress={onShuffle} hitSlop={10} style={styles.smallBtn}>
              <Icon name="shuffle" size={22} color={shuffle ? colors.accent : colors.textMuted} />
            </Pressable>
            <Pressable
              onPress={() => TrackPlayer.skipToPrevious().catch(() => {})}
              hitSlop={10}
              style={styles.smallBtn}
            >
              <Icon name="skip-previous" size={36} color={colors.text} />
            </Pressable>
            <Pressable onPress={togglePlay} disabled={isLoading} style={styles.playBtn}>
              <Icon name={isPlaying ? 'pause' : 'play'} size={36} color={colors.bg} />
            </Pressable>
            <Pressable
              onPress={() => TrackPlayer.skipToNext().catch(() => {})}
              hitSlop={10}
              style={styles.smallBtn}
            >
              <Icon name="skip-next" size={36} color={colors.text} />
            </Pressable>
            <Pressable onPress={onRepeat} hitSlop={10} style={styles.smallBtn}>
              <Icon
                name={repeat === 'track' ? 'repeat-one' : 'repeat'}
                size={22}
                color={repeat !== 'off' ? colors.accent : colors.textMuted}
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  closeBtn: { padding: spacing.md, alignSelf: 'flex-start' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { ...typography.body, color: colors.textMuted },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  iconBtn: { padding: spacing.xs },
  topTitleWrap: { flex: 1, alignItems: 'center' },
  topLabel: { ...typography.caption, color: colors.textMuted, letterSpacing: 1 },
  artworkSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  artwork: {
    aspectRatio: 1,
    width: '100%',
    borderRadius: radii.lg,
    backgroundColor: colors.bgMuted,
  },
  artworkFallback: { alignItems: 'center', justifyContent: 'center' },
  bottomSection: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, gap: spacing.lg },
  titleRow: { gap: spacing.xs },
  title: { ...typography.title, color: colors.text, fontSize: 24 },
  artist: { ...typography.body, color: colors.textMuted },
  progressWrap: { gap: 4 },
  timesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  time: { ...typography.caption, color: colors.textMuted },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  smallBtn: { padding: spacing.sm },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
