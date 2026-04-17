import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
import StockCard from '@/components/StockCard';
import ToolCard from '@/components/ToolCard';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useStockItems } from '@/services/stock/useStock';
import { useTools } from '@/services/tools/useTools';

type Segment = 'tools' | 'stock';
type ToolFilter = 'all' | 'available' | 'inUse' | 'depleted';
type StockFilter = 'all' | 'low';

const TOOL_FILTERS: { key: ToolFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'available', label: 'Disponíveis' },
  { key: 'inUse', label: 'Em uso' },
  { key: 'depleted', label: 'Esgotadas' },
];

const STOCK_FILTERS: { key: StockFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'low', label: 'Em baixa' },
];

export default function InventoryScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [segment, setSegment] = useState<Segment>('tools');
  const [toolFilter, setToolFilter] = useState<ToolFilter>('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');

  const { data: tools, isLoading: isLoadingTools, error: toolsError, refetch: refetchTools } = useTools();
  const { data: stockItems, isLoading: isLoadingStock, error: stockError, refetch: refetchStock } = useStockItems();

  useFocusEffect(
    useCallback(() => {
      refetchTools();
      refetchStock();
    }, [refetchTools, refetchStock])
  );

  if (user?.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas administradores podem acessar o inventário.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredTools = (tools ?? []).filter((t) => {
    if (toolFilter === 'available') return t.availableQuantity === t.totalQuantity;
    if (toolFilter === 'inUse')
      return t.availableQuantity < t.totalQuantity && t.availableQuantity > 0;
    if (toolFilter === 'depleted') return t.availableQuantity === 0;
    return true;
  });

  const filteredStock = (stockItems ?? []).filter((s) => {
    if (stockFilter === 'low') return s.isLow;
    return true;
  });

  const handleCreate = () => {
    if (segment === 'tools') {
      router.push('/(app)/tools/create');
    } else {
      router.push('/(app)/stock/create');
    }
  };

  const count = segment === 'tools' ? filteredTools.length : filteredStock.length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Inventário</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleCreate}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Segmented control */}
      <View style={styles.segment}>
        <SegmentButton
          label="Ferramentas"
          icon="build"
          active={segment === 'tools'}
          onPress={() => setSegment('tools')}
        />
        <SegmentButton
          label="Estoque"
          icon="inventory"
          active={segment === 'stock'}
          onPress={() => setSegment('stock')}
        />
      </View>

      {/* Filter chips */}
      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {segment === 'tools'
            ? TOOL_FILTERS.map((f) => (
                <FilterChip
                  key={f.key}
                  label={f.label}
                  active={toolFilter === f.key}
                  onPress={() => setToolFilter(f.key)}
                />
              ))
            : STOCK_FILTERS.map((f) => (
                <FilterChip
                  key={f.key}
                  label={f.label}
                  active={stockFilter === f.key}
                  onPress={() => setStockFilter(f.key)}
                />
              ))}
        </ScrollView>
      </View>

      {/* List */}
      {segment === 'tools' ? (
        isLoadingTools ? (
          <View style={styles.centered}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : toolsError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Erro ao carregar ferramentas</Text>
            <TouchableOpacity onPress={refetchTools}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            key="tools-list"
            style={styles.list}
            data={filteredTools}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ToolCard
                tool={item}
                onPress={() =>
                  router.push({
                    pathname: '/(app)/tools/[id]',
                    params: { id: item.id },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <MaterialIcons name="build" size={64} color={Colors.textMuted} />
                <Text style={styles.emptyText}>Nenhuma ferramenta encontrada</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        isLoadingStock ? (
          <View style={styles.centered}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : stockError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Erro ao carregar estoque</Text>
            <TouchableOpacity onPress={refetchStock}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            key="stock-list"
            style={styles.list}
            data={filteredStock}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <StockCard
                item={item}
                onPress={() =>
                  router.push({
                    pathname: '/(app)/stock/[id]',
                    params: { id: item.id },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <MaterialIcons name="inventory" size={64} color={Colors.textMuted} />
                <Text style={styles.emptyText}>Nenhum item encontrado</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )
      )}
    </SafeAreaView>
  );
}

function SegmentButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.segmentBtn, active && styles.segmentBtnActive]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <MaterialIcons
        name={icon}
        size={18}
        color={active ? Colors.white : Colors.textSecondary}
      />
      <Text
        style={[styles.segmentText, active && styles.segmentTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
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
  segment: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 4,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: Colors.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  segmentTextActive: {
    color: Colors.white,
    fontWeight: '700',
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  retryText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
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
