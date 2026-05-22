import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors } from '@/theme';

export type IconName =
  | 'play'
  | 'pause'
  | 'skip-next'
  | 'skip-previous'
  | 'shuffle'
  | 'repeat'
  | 'repeat-one'
  | 'search'
  | 'queue'
  | 'library'
  | 'close'
  | 'more'
  | 'chevron-down'
  | 'chevron-right'
  | 'plus'
  | 'check'
  | 'trash'
  | 'add-to-queue'
  | 'music';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 24, color = colors.text }: Props) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const };
  switch (name) {
    case 'play':
      return (
        <Svg {...props}>
          <Path d="M8 5.5v13l11-6.5L8 5.5Z" fill={color} />
        </Svg>
      );
    case 'pause':
      return (
        <Svg {...props}>
          <Rect x="6" y="5" width="4" height="14" rx="1" fill={color} />
          <Rect x="14" y="5" width="4" height="14" rx="1" fill={color} />
        </Svg>
      );
    case 'skip-next':
      return (
        <Svg {...props}>
          <Path d="M6 5l10 7-10 7V5Z" fill={color} />
          <Rect x="17" y="5" width="2.5" height="14" rx="0.5" fill={color} />
        </Svg>
      );
    case 'skip-previous':
      return (
        <Svg {...props}>
          <Path d="M18 5L8 12l10 7V5Z" fill={color} />
          <Rect x="4.5" y="5" width="2.5" height="14" rx="0.5" fill={color} />
        </Svg>
      );
    case 'shuffle':
      return (
        <Svg {...props}>
          <Path d="M16 4h4v4M4 20l16-16M4 4l6 6M16 20h4v-4M14 14l6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'repeat':
      return (
        <Svg {...props}>
          <Path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'repeat-one':
      return (
        <Svg {...props}>
          <Path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M11 11h2v4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'search':
      return (
        <Svg {...props}>
          <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={2} />
          <Path d="m20 20-3.5-3.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'queue':
      return (
        <Svg {...props}>
          <Path d="M3 6h13M3 12h13M3 18h9M17 14v7M21 16l-4 5-2-2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'library':
      return (
        <Svg {...props}>
          <Path d="M4 4v16M9 4v16M15 6l5 14M14 6l1-2 6 2-1 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'close':
      return (
        <Svg {...props}>
          <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'more':
      return (
        <Svg {...props}>
          <Circle cx="5" cy="12" r="1.6" fill={color} />
          <Circle cx="12" cy="12" r="1.6" fill={color} />
          <Circle cx="19" cy="12" r="1.6" fill={color} />
        </Svg>
      );
    case 'chevron-down':
      return (
        <Svg {...props}>
          <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'chevron-right':
      return (
        <Svg {...props}>
          <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...props}>
          <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'check':
      return (
        <Svg {...props}>
          <Path d="M4 12l5 5L20 6" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'trash':
      return (
        <Svg {...props}>
          <Path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'add-to-queue':
      return (
        <Svg {...props}>
          <Path d="M3 6h13M3 12h13M3 18h9M19 15v6M16 18h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'music':
      return (
        <Svg {...props}>
          <Path d="M9 18V5l12-2v13" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="6" cy="18" r="3" stroke={color} strokeWidth={2} />
          <Circle cx="18" cy="16" r="3" stroke={color} strokeWidth={2} />
        </Svg>
      );
    default:
      return null;
  }
}
