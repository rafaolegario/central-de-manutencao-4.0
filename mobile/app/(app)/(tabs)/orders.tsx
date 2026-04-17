import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { STATUS_LABELS } from '@/data/mock';
import { useOrders } from '@/services/orders/useOrders';
import { useUsers } from '@/services/users/useUsers';
import type { ServiceOrderStatus } from '@/types/api';

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

  const { data, isLoading, error, refetch } = useOrders({
    status: selected === 'all' ? undefined : selected,
  });
  const { data: usersData } = useUsers();

  const userMap: Record<string, string> = Object.fromEntries(
    (usersData ?? []).map((u) => [u.id, u.name])
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Ordens de Serviço</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{data?.totalCount ?? 0}</Text>
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
      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
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
      </View>

      {/* Error banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>Erro ao carregar ordens</Text>
          <TouchableOpacity onPress={refetch}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      <FlatList
        style={styles.list}
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ServiceOrderCard
            order={item}
            technicianName={item.technicianId ? (userMap[item.technicianId] ?? 'Não atribuído') : 'Não atribuído'}
            onPress={() =>
              router.push({ pathname: '/(app)/orders/[id]', params: { id: item.id } })
            }
          />
        )}
        ListHeaderComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={Colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <MaterialIcons name="inbox" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Nenhuma ordem encontrada</Text>
            </View>
          ) : null
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
  chipsWrapper: {
    overflow: 'hidden',
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: Colors.radiusLg,
  },
  errorText: {
    fontSize: 13,
    color: '#991B1B',
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
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
