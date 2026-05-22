import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  IOSCategory,
  IOSCategoryMode,
  IOSCategoryOptions,
  RepeatMode as TPRepeatMode,
  Track,
} from 'react-native-track-player';
import { api } from '@/api/client';
import type { TrackSummary } from '@/api/types';
import type { RepeatMode } from '@/store/playerStore';

let isSetup = false;

export async function setupPlayer(): Promise<void> {
  if (isSetup) return;

  try {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
      iosCategory: IOSCategory.Playback,
      iosCategoryMode: IOSCategoryMode.Default,
      iosCategoryOptions: [IOSCategoryOptions.AllowAirPlay, IOSCategoryOptions.AllowBluetooth],
    });
  } catch (err) {
    const message = (err as Error).message || '';
    if (!message.includes('player has already been initialized')) throw err;
  }

  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    progressUpdateEventInterval: 1,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.Stop,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
      Capability.JumpForward,
      Capability.JumpBackward,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious],
    notificationCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
    ],
    forwardJumpInterval: 15,
    backwardJumpInterval: 15,
  });

  isSetup = true;
}

export function toRNTPTrack(t: TrackSummary): Track {
  return {
    id: t.id,
    url: api.streamProxyUrl(t.id),
    title: t.title,
    artist: t.artist || 'YouTube',
    artwork: t.thumbnail,
    duration: t.duration,
  };
}

export async function loadQueue(tracks: TrackSummary[], startIndex = 0): Promise<void> {
  await setupPlayer();
  await TrackPlayer.reset();
  await TrackPlayer.add(tracks.map(toRNTPTrack));
  if (startIndex > 0) await TrackPlayer.skip(startIndex);
  await TrackPlayer.play();
}

export async function playOne(track: TrackSummary): Promise<void> {
  await loadQueue([track], 0);
}

export async function appendToQueue(track: TrackSummary): Promise<void> {
  await setupPlayer();
  await TrackPlayer.add([toRNTPTrack(track)]);
}

export async function playNext(track: TrackSummary): Promise<void> {
  await setupPlayer();
  const currentIndex = await TrackPlayer.getActiveTrackIndex();
  const insertAt = currentIndex == null ? undefined : currentIndex + 1;
  await TrackPlayer.add([toRNTPTrack(track)], insertAt);
}

export async function applyRepeatMode(mode: RepeatMode): Promise<void> {
  await setupPlayer();
  const tp =
    mode === 'track' ? TPRepeatMode.Track : mode === 'queue' ? TPRepeatMode.Queue : TPRepeatMode.Off;
  await TrackPlayer.setRepeatMode(tp);
}

export async function applyShuffle(shuffle: boolean, originalQueue: TrackSummary[]): Promise<void> {
  await setupPlayer();
  const activeIndex = await TrackPlayer.getActiveTrackIndex();
  if (activeIndex == null || !originalQueue.length) return;

  const current = originalQueue[activeIndex];
  if (!current) return;

  let next: TrackSummary[];
  if (shuffle) {
    const rest = originalQueue.filter((_, i) => i !== activeIndex);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    next = [current, ...rest];
  } else {
    next = originalQueue;
  }

  const startIndex = next.findIndex((t) => t.id === current.id);
  await TrackPlayer.reset();
  await TrackPlayer.add(next.map(toRNTPTrack));
  if (startIndex > 0) await TrackPlayer.skip(startIndex);
  await TrackPlayer.play();
}
