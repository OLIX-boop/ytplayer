import { useEffect, useState } from 'react';
import TrackPlayer, {
  Event,
  State,
  Track,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';

export function useNowPlaying() {
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const progress = useProgress(500);
  const [queueLength, setQueueLength] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      try {
        const queue = await TrackPlayer.getQueue();
        const idx = await TrackPlayer.getActiveTrackIndex();
        if (!mounted) return;
        setQueueLength(queue.length);
        setActiveIndex(idx ?? null);
      } catch {}
    };
    refresh();
    const sub = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, refresh);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return {
    track: activeTrack as Track | undefined,
    state: playbackState.state,
    isPlaying: playbackState.state === State.Playing,
    isLoading: playbackState.state === State.Loading || playbackState.state === State.Buffering,
    position: progress.position,
    duration: progress.duration,
    buffered: progress.buffered,
    queueLength,
    activeIndex,
  };
}
