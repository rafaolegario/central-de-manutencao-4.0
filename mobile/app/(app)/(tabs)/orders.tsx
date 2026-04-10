import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ServiceOrderCard from '@/components/ServiceOrderCard';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  MOCK_SERVICE_ORDERS,
  MockServiceOrder,
  ServiceOrderStatus,
  STATUS_LABELS,
} from '@/data/mock';

type FilterOption = 'all' | ServiceOrderStatus;

const FILTERS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'Open', label: STATUS_LABELS.Open },
  { key: 'Assigned', label: STATUS_LABELS.Assigned },
  { key: 'InProgress', label: STATUS_LABELS.InProgress },
  { key: 'Paused', label: STATUS_LABELS.Paused },
  { key: 'Completed', label: STATUS_LABELS.Completed },
  { key: 'Approved', label: STATUS_LABELS.Approved },
  { key: 'Rejected', label: STATUS_LABELS.Rejected },
  { key: 'Reopened', label: STATUS_LABELS.Reopened },
  { key: 'Canceled', label: STATUS_LABELS.Canceled },
];

export default function OrdersScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<FilterOption>('all');

  const filtered: MockServiceOrder[] =
    selected === 'all'
      ? MOCK_SERVICE_ORDERS
      : MOCK_SERVICE_ORDERS.filter((o) => o.status === selected);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Ordens de Serviço</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filtered.length}</Text>
          </View>
        </View>
        {user?.role === 'Admin' && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/(app)/orders/create')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add" size={22} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsScroll}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, selected === f.key && styles.chipActive]}
            onPress={() => setSelected(f.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.chipText, selected === f.key && styles.chipTextActive]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ServiceOrderCard
            order={item}
            onPress={() =>
              router.push({ pathname: '/(app)/orders/[id]', params: { id: item.id } })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="inbox" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma ordem encontrada</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  countBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsScroll: {
    flexGrow: 0,
  },
  chips: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textMuted,
  },
});
