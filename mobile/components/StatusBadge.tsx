import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { STATUS_LABELS } from '@/constants/labels';
import type { ServiceOrderStatus } from '@/types/api';

interface StatusBadgeProps {
  status: ServiceOrderStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const palette = Colors.status[status] ?? { bg: '#F3F4F6', text: '#4B5563' };
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: palette.bg },
        isSm ? styles.sm : styles.md,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: palette.text },
          isSm ? styles.labelSm : styles.labelMd,
        ]}
      >
        {STATUS_LABELS[status] ?? status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  label: {
    fontWeight: '600',
  },
  labelSm: {
    fontSize: 10,
  },
  labelMd: {
    fontSize: 12,
  },
});
