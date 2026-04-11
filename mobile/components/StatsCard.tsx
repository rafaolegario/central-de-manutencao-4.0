import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBgColor: string;
  iconColor: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  onPress,
  style,
}: StatsCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <MaterialIcons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Colors.radiusLg,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Colors.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  title: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
