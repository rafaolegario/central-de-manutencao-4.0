import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary:   { bg: Colors.primary,      text: '#FFFFFF' },
  secondary: { bg: Colors.primaryLight, text: Colors.primary },
  ghost:     { bg: 'transparent',       text: Colors.textPrimary, border: Colors.border },
  danger:    { bg: Colors.error,         text: '#FFFFFF' },
};

const SIZE_STYLES: Record<Size, { px: number; py: number; fontSize: number; iconSize: number }> = {
  sm: { px: 12, py: 8,  fontSize: 13, iconSize: 16 },
  md: { px: 20, py: 12, fontSize: 15, iconSize: 18 },
  lg: { px: 24, py: 16, fontSize: 16, iconSize: 20 },
};

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}: AppButtonProps) {
  const v = VARIANT_STYLES[variant];
  const s = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          backgroundColor: v.bg,
          paddingHorizontal: s.px,
          paddingVertical: s.py,
          borderWidth: v.border ? 1.5 : 0,
          borderColor: v.border ?? 'transparent',
          opacity: isDisabled ? 0.55 : 1,
        },
        fullWidth && styles.fullWidth,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon && (
            <MaterialIcons
              name={icon}
              size={s.iconSize}
              color={v.text}
              style={styles.icon}
            />
          )}
          <Text style={[styles.label, { color: v.text, fontSize: s.fontSize }]}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Colors.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {},
  label: {
    fontWeight: '700',
  },
});
