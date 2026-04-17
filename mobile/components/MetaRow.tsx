import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface MetaRowProps {
  label: string;
  value: string;
  labelWidth?: number;
}

export default function MetaRow({ label, value, labelWidth = 110 }: MetaRowProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { width: labelWidth }]}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
});
