import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/AppButton';
import ServiceOrderCard from '@/components/ServiceOrderCard';
import StatsCard from '@/components/StatsCard';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useApiQuery } from '@/services/api/useApiQuery';
import { useOrders } from '@/services/orders/useOrders';
import { useStockItems } from '@/services/stock/useStock';
import { listActiveUsages, listMyUsages } from '@/services/tools/toolService';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'Admin';

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders,
  } = useOrders();
  const { data: lowStockItems, refetch: refetchStock } = useStockItems(
    isAdmin ? true : undefined
  );
  const { data: activeUsagesData, refetch: refetchUsages } = useApiQuery(
    () => (isAdmin ? listActiveUsages() : listMyUsages()),
    [isAdmin]
  );

  useFocusEffect(
    useCallback(() => {
      refetchOrders();
      if (isAdmin) refetchStock();
      refetchUsages();
    }, [refetchOrders, refetchStock, refetchUsages, isAdmin])
  );

  const firstName = user?.name?.split(' ')[0] ?? 'Olá';

  const orders = ordersData?.items ?? [];
  const activeUsages = activeUsagesData?.items ?? [];

  const criticalCount = orders.filter(
    (o) => o.priority === 'Critical' && o.status !== 'Canceled' && o.status !== 'Approved'
  ).length;
  const openCount = orders.filter(
    (o) => o.status === 'Open' || o.status === 'Reopened'
  ).length;
  const inProgressCount = orders.filter((o) => o.status === 'InProgress').length;
  const doneCount = orders.filter(
    (o) => o.status === 'Completed' || o.status === 'Approved'
  ).length;

  const toolsInUseCount = activeUsages.length;
  const lowStockCount = (lowStockItems ?? []).length;
  const myToolsInUseCount = user
    ? activeUsages.filter((u) => u.technicianId === user.id && !u.returnedAt).length
    : 0;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bom dia, {firstName}</Text>
            <Text style={styles.headerSub}>Visão geral do sistema</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8}>
            <MaterialIcons name="notifications-none" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stats grid — 2×2 */}
        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatsCard
              title="Críticas"
              value={criticalCount}
              icon="assignment-late"
              iconBgColor="#FEE2E2"
              iconColor="#DC2626"
              style={styles.statsCardFlex}
            />
            <StatsCard
              title="Abertas"
              value={openCount}
              icon="pending-actions"
              iconBgColor="#DBEAFE"
              iconColor="#1D4ED8"
              style={styles.statsCardFlex}
            />
          </View>
          <View style={styles.statsRow}>
            <StatsCard
              title="Andamento"
              value={inProgressCount}
              icon="engineering"
              iconBgColor="#FEF3C7"
              iconColor="#92400E"
              style={styles.statsCardFlex}
            />
            <StatsCard
              title="Concluídas"
              value={doneCount}
              icon="check-circle"
              iconBgColor="#DCFCE7"
              iconColor="#15803D"
              style={styles.statsCardFlex}
            />
          </View>

          {isAdmin ? (
            <View style={styles.statsRow}>
              <StatsCard
                title="Ferram. em uso"
                value={toolsInUseCount}
                icon="build"
                iconBgColor="#FFEDD5"
                iconColor="#C2410C"
                style={styles.statsCardFlex}
              />
              <StatsCard
                title="Itens em baixa"
                value={lowStockCount}
                icon="warning-amber"
                iconBgColor="#FEE2E2"
                iconColor="#DC2626"
                style={styles.statsCardFlex}
              />
            </View>
          ) : (
            <View style={styles.statsRow}>
              <StatsCard
                title="Minhas ferram."
                value={myToolsInUseCount}
                icon="build"
                iconBgColor="#FFEDD5"
                iconColor="#C2410C"
                style={styles.statsCardFlex}
              />
            </View>
          )}
        </View>

        {/* Recent orders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ordens Recentes</Text>
          <TouchableOpacity
            onPress={() => router.push('/(app)/(tabs)/orders')}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {ordersError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>Erro ao carregar ordens</Text>
            <TouchableOpacity onPress={refetchOrders}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : isLoadingOrders ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : recentOrders.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="inbox" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma ordem recente</Text>
          </View>
        ) : (
          recentOrders.map((order) => (
            <ServiceOrderCard
              key={order.id}
              order={order}
              technicianName={order.technicianName ?? 'Não atribuído'}
              onPress={() =>
                router.push({ pathname: '/(app)/orders/[id]', params: { id: order.id } })
              }
            />
          ))
        )}

        {/* Quick actions (admin only) */}
        {isAdmin && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Ações Rápidas</Text>
            <View style={styles.actionRow}>
              <AppButton
                label="Nova Ordem"
                icon="add"
                onPress={() => router.push('/(app)/orders/create')}
                variant="primary"
                size="md"
              />
              <AppButton
                label="Novo Usuário"
                icon="person-add"
                onPress={() => router.push('/(app)/users/create')}
                variant="secondary"
                size="md"
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    gap: 12,
    marginBottom: 28,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statsCardFlex: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: Colors.radiusLg,
    marginBottom: 12,
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
});
