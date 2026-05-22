export const colors = {
  bg: '#0a0a0f',
  bgElevated: '#15151c',
  bgCard: '#1d1d27',
  bgMuted: '#26262f',

  text: '#ffffff',
  textMuted: '#a1a1aa',
  textSubtle: '#71717a',

  accent: '#1ed760',
  accentMuted: '#16a34a',
  accentBg: 'rgba(30, 215, 96, 0.12)',

  danger: '#ef4444',
  border: 'rgba(255,255,255,0.06)',
  overlay: 'rgba(0,0,0,0.55)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.5 },
  title: { fontSize: 22, fontWeight: '700' as const },
  heading: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '500' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
} as const;

export const layout = {
  miniPlayerHeight: 64,
  tabBarHeight: 56,
} as const;
