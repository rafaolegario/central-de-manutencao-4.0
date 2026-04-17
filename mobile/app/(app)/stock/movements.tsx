import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/AppButton';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { STOCK_MOVEMENT_LABELS } from '@/constants/labels';
import { getMovementsForStockItem, getStockItemById, MockStockMovement } from '@/data/mock';
import { formatDateTime } from '@/utils/format';

export default function StockMovementsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  if (user?.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas administradores podem ver movimentações de estoque.
          </Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  const item = getStockItemById(id);
  const movements = getMovementsForStockItem(id);

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <MaterialIcons name="search-off" size={64} color={Colors.textMuted} />
          <Text style={styles.notFoundText}>Item não encontrado</Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.headerCard}>
        <Text style={styles.headerCode}>{item.code}</Text>
        <Text style={styles.headerName}>{item.name}</Text>
        <Text style={styles.headerMeta}>
          {movements.length} movimentaç{movements.length === 1 ? 'ão' : 'ões'}
        </Text>
      </View>

      <FlatList
        data={movements}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: m }) => <MovementRow movement={m} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="history" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma movimentação registrada</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function MovementRow({ movement }: { movement: MockStockMovement }) {
  const isIn = movement.type === 'In';
  const icon = isIn ? 'arrow-downward' : 'arrow-upward';
  const color = isIn ? Colors.success : Colors.error;
  const bgColor = isIn ? Colors.successLight : Colors.errorLight;
  const signPrefix = isIn ? '+' : '−';

  return (
    <View style={rowStyles.row}>
      <View style={[rowStyles.iconWrap, { backgroundColor: bgColor }]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <View style={rowStyles.body}>
        <View style={rowStyles.topLine}>
          <Text style={rowStyles.type}>{STOCK_MOVEMENT_LABELS[movement.type]}</Text>
          <Text style={[rowStyles.qty, { color }]}>
            {signPrefix}
            {movement.quantity}
          </Text>
        </View>
        <Text style={rowStyles.date}>{formatDateTime(movement.createdAt)}</Text>
        {movement.note && <Text style={rowStyles.note}>{movement.note}</Text>}
        {movement.workOrderId && (
          <Text style={rowStyles.order}>OS: {movement.workOrderId}</Text>
        )}
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: Colors.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  type: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  qty: {
    fontSize: 16,
    fontWeight: '800',
  },
  date: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 3,
  },
  note: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
    lineHeight: 17,
  },
  order: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerCard: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerCode: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  headerMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
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
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  restricted: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  restrictedIcon: {
    fontSize: 48,
  },
  restrictedTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  restrictedSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
