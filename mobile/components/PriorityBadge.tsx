import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { PRIORITY_LABELS } from '@/constants/labels';
import type { ServiceOrderPriority } from '@/types/api';

interface PriorityBadgeProps {
  priority: ServiceOrderPriority;
  size?: 'sm' | 'md';
}

export default function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const palette = Colors.priority[priority] ?? { bg: '#F3F4F6', text: '#4B5563' };
  const isSm = size === 'sm';
  const isCritical = priority === 'Critical';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: palette.bg },
        isSm ? styles.sm : styles.md,
      ]}
    >
      {isCritical && (
        <View style={[styles.dot, { backgroundColor: palette.text }]} />
      )}
      <Text
        style={[
          styles.label,
          { color: palette.text },
          isSm ? styles.labelSm : styles.labelMd,
        ]}
      >
        {PRIORITY_LABELS[priority] ?? priority}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  md: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
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
