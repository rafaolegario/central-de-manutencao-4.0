import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { formatDate, getTechnicianName, MockServiceOrder } from '@/data/mock';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

interface ServiceOrderCardProps {
  order: MockServiceOrder;
  onPress: () => void;
}

export default function ServiceOrderCard({ order, onPress }: ServiceOrderCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.badgeRow}>
        <PriorityBadge priority={order.priority} size="sm" />
        <StatusBadge status={order.status} size="sm" />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {order.title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {order.description}
      </Text>

      {order.location && (
        <View style={styles.metaRow}>
          <MaterialIcons name="location-on" size={13} color={Colors.textMuted} />
          <Text style={styles.metaText} numberOfLines={1}>
            {order.location}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.metaRow}>
          <MaterialIcons name="calendar-today" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText}>{formatDate(order.createdAt)}</Text>
        </View>
        <Text style={styles.technicianText}>
          {getTechnicianName(order.technicianId)}
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
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  technicianText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
