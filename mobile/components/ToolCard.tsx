import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import type { Tool } from '@/types/api';

interface ToolCardProps {
  tool: Tool;
  onPress: () => void;
}

export default function ToolCard({ tool, onPress }: ToolCardProps) {
  const ratio =
    tool.totalQuantity > 0 ? tool.availableQuantity / tool.totalQuantity : 0;

  let dotColor = Colors.success;
  let statusLabel = 'Disponível';
  if (tool.availableQuantity === 0) {
    dotColor = Colors.error;
    statusLabel = 'Esgotada';
  } else if (tool.availableQuantity < tool.totalQuantity) {
    dotColor = Colors.warning;
    statusLabel = 'Parcial';
  }

  const barColor =
    tool.availableQuantity === 0
      ? Colors.error
      : tool.availableQuantity < tool.totalQuantity
        ? Colors.warning
        : Colors.success;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <MaterialIcons name="build" size={22} color={Colors.primary} />
        </View>
        <View style={styles.headingCol}>
          <Text style={styles.code}>{tool.code}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {tool.name}
          </Text>
        </View>
        <View style={styles.statusCol}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={[styles.statusLabel, { color: dotColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${ratio * 100}%`, backgroundColor: barColor },
            ]}
          />
        </View>
        <Text style={styles.countText}>
          {tool.availableQuantity}/{tool.totalQuantity}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Colors.radiusLg,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingCol: {
    flex: 1,
  },
  code: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  statusCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },
});
