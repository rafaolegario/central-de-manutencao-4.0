import { Platform } from 'react-native';

export const Colors = {
  // Brand
  primary: '#F97316',
  primaryLight: '#FFEDD5',
  primaryDark: '#EA6C00',

  // Backgrounds
  white: '#FFFFFF',
  surface: '#FAFAFA',

  // Borders
  border: '#E5E7EB',

  // Text
  textPrimary: '#292524',
  textSecondary: '#78716C',
  textMuted: '#A8A29E',

  // Semantic
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Border radius constants
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 20,

  // Status color map
  status: {
    Open:       { bg: '#DBEAFE', text: '#1D4ED8' },
    Assigned:   { bg: '#EDE9FE', text: '#6D28D9' },
    InProgress: { bg: '#FEF3C7', text: '#92400E' },
    Paused:     { bg: '#FEE2E2', text: '#991B1B' },
    Completed:  { bg: '#DCFCE7', text: '#15803D' },
    Approved:   { bg: '#DCFCE7', text: '#166534' },
    Rejected:   { bg: '#FEE2E2', text: '#DC2626' },
    Reopened:   { bg: '#EDE9FE', text: '#7C3AED' },
    Canceled:   { bg: '#F3F4F6', text: '#4B5563' },
  } as Record<string, { bg: string; text: string }>,

  // Priority color map
  priority: {
    Low:      { bg: '#F3F4F6', text: '#4B5563' },
    Medium:   { bg: '#FEF3C7', text: '#92400E' },
    High:     { bg: '#FFEDD5', text: '#C2410C' },
    Critical: { bg: '#FEE2E2', text: '#DC2626' },
  } as Record<string, { bg: string; text: string }>,

  // Backward-compatibility shim for existing components
  light: {
    text: '#292524',
    background: '#FFFFFF',
    tint: '#F97316',
    icon: '#78716C',
    tabIconDefault: '#A8A29E',
    tabIconSelected: '#F97316',
  },
  dark: {
    text: '#292524',
    background: '#FFFFFF',
    tint: '#F97316',
    icon: '#78716C',
    tabIconDefault: '#A8A29E',
    tabIconSelected: '#F97316',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
