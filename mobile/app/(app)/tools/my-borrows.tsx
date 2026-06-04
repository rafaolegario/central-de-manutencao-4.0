import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { formatDateTime } from '@/utils/format';
import { useMyStockMovements } from '@/services/stock/useStock';
import { useMyToolUsages } from '@/services/tools/useTools';

export default function MyBorrowsScreen() {
  const {
    data: toolUsagesData,
    isLoading: isLoadingTools,
    refetch: refetchTools,
  } = useMyToolUsages();
  const {
    data: stockMovements,
    isLoading: isLoadingStock,
    refetch: refetchStock,
  } = useMyStockMovements();

  useFocusEffect(
    useCallback(() => {
      refetchTools();
      refetchStock();
    }, [refetchTools, refetchStock])
  );

  const toolUsages = toolUsagesData?.items ?? [];
  const stockItems = stockMovements ?? [];
  const isLoading = isLoadingTools || isLoadingStock;
  const isEmpty = toolUsages.length === 0 && stockItems.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : isEmpty ? (
          <View style={styles.empty}>
            <MaterialIcons name="history" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Você ainda não tem retiradas</Text>
          </View>
        ) : (
          <>
            {/* Tools */}
            <Text style={styles.sectionTitle}>
              Ferramentas {toolUsages.length > 0 && `(${toolUsages.length})`}
            </Text>
            {toolUsages.length === 0 ? (
              <Text style={styles.noData}>Nenhuma ferramenta retirada.</Text>
            ) : (
              <View style={styles.list}>
                {toolUsages.map((usage) => {
                  const active = !usage.returnedAt;
                  return (
                    <View key={usage.id} style={styles.row}>
                      <View style={styles.iconWrap}>
                        <MaterialIcons name="build" size={20} color={Colors.primary} />
                      </View>
                      <View style={styles.rowBody}>
                        <Text style={styles.rowTitle} numberOfLines={1}>
                          {usage.toolName ?? 'Ferramenta'}
                        </Text>
                        <Text style={styles.rowMeta}>
                          Retirada em {formatDateTime(usage.withdrawnAt)}
                        </Text>
                        {usage.returnedAt && (
                          <Text style={styles.rowMeta}>
                            Devolvida em {formatDateTime(usage.returnedAt)}
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.statusPill,
                          active ? styles.statusActive : styles.statusDone,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            active ? styles.statusTextActive : styles.statusTextDone,
                          ]}
                        >
                          {active ? 'Em uso' : 'Devolvida'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Stock */}
            <Text style={[styles.sectionTitle, styles.sectionGap]}>
              Estoque {stockItems.length > 0 && `(${stockItems.length})`}
            </Text>
            {stockItems.length === 0 ? (
              <Text style={styles.noData}>Nenhum item retirado.</Text>
            ) : (
              <View style={styles.list}>
                {stockItems.map((m) => (
                  <View key={m.id} style={styles.row}>
                    <View style={styles.iconWrap}>
                      <MaterialIcons name="inventory" size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.rowBody}>
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {m.stockItemName ?? 'Item'}
                      </Text>
                      <Text style={styles.rowMeta}>
                        Retirado em {formatDateTime(m.createdAt)}
                      </Text>
                      {m.note ? (
                        <Text style={styles.rowMeta} numberOfLines={2}>
                          {m.note}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.qtyPill}>
                      <Text style={styles.qtyText}>−{m.quantity}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  sectionGap: {
    marginTop: 28,
  },
  noData: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Colors.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  rowMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusActive: {
    backgroundColor: Colors.primaryLight,
  },
  statusDone: {
    backgroundColor: Colors.surface,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextActive: {
    color: Colors.primary,
  },
  statusTextDone: {
    color: Colors.textSecondary,
  },
  qtyPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.surface,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
});
