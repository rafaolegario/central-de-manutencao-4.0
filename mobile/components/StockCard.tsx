import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { MockStockItem, isLowStock } from '@/data/mock';

interface StockCardProps {
  item: MockStockItem;
  onPress: () => void;
}

export default function StockCard({ item, onPress }: StockCardProps) {
  const low = isLowStock(item);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, low && styles.iconWrapLow]}>
          <MaterialIcons
            name="inventory"
            size={22}
            color={low ? Colors.error : Colors.primary}
          />
        </View>
        <View style={styles.headingCol}>
          <Text style={styles.code}>{item.code}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
        {low && (
          <View style={styles.lowBadge}>
            <MaterialIcons name="warning-amber" size={12} color={Colors.error} />
            <Text style={styles.lowBadgeText}>Em baixa</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.qtyBlock}>
          <Text style={styles.qtyLabel}>Quantidade</Text>
          <Text style={[styles.qtyValue, low && { color: Colors.error }]}>
            {item.quantity}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.qtyBlock}>
          <Text style={styles.qtyLabel}>Mínimo</Text>
          <Text style={styles.qtyValueSm}>{item.minQuantity}</Text>
        </View>
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
  iconWrapLow: {
    backgroundColor: Colors.errorLight,
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
  lowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.errorLight,
  },
  lowBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.error,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  qtyBlock: {
    flex: 1,
  },
  qtyLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  qtyValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  qtyValueSm: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
});
