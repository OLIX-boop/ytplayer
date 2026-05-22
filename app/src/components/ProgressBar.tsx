import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

interface Props {
  position: number;
  duration: number;
  onSeek: (seconds: number) => void;
}

export function ProgressBar({ position, duration, onSeek }: Props) {
  const [width, setWidth] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);

  useEffect(() => {
    if (!dragging) setDragX(0);
  }, [dragging]);

  const ratio = (() => {
    if (dragging && width > 0) return Math.max(0, Math.min(1, dragX / width));
    if (!duration) return 0;
    return Math.max(0, Math.min(1, position / duration));
  })();

  const responder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      setDragging(true);
      setDragX(e.nativeEvent.locationX);
    },
    onPanResponderMove: (e) => setDragX(e.nativeEvent.locationX),
    onPanResponderRelease: (e) => {
      const finalX = e.nativeEvent.locationX;
      const r = width > 0 ? Math.max(0, Math.min(1, finalX / width)) : 0;
      onSeek(r * duration);
      setDragging(false);
    },
    onPanResponderTerminate: () => setDragging(false),
  });

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.wrap} onLayout={onLayout} {...responder.panHandlers}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
        <View style={[styles.thumb, { left: `${ratio * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 28, justifyContent: 'center' },
  track: { height: 4, backgroundColor: colors.bgMuted, borderRadius: 2, overflow: 'visible' },
  fill: { height: 4, backgroundColor: colors.accent, borderRadius: 2 },
  thumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.text,
    marginLeft: -8,
  },
});
