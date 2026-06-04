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
import { useStockItems } from '@/services/stock/useStock';
import { useTools } from '@/services/tools/useTools';

type Segment = 'tools' | 'stock';
type ToolFilter = 'all' | 'available';

const FILTERS: { key: ToolFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'available', label: 'Disponíveis' },
];

export default function TechnicianToolsScreen() {
  const router = useRouter();

  const [segment, setSegment] = useState<Segment>('tools');
  const [selected, setSelected] = useState<ToolFilter>('all');

  const { data: tools, isLoading, error, refetch } = useTools();
  const {
    data: stockItems,
    isLoading: isLoadingStock,
    error: stockError,
    refetch: refetchStock,
  } = useStockItems();

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchStock();
    }, [refetch, refetchStock])
  );

  const filtered = (tools ?? []).filter((t) => {
    if (selected === 'available') return t.availableQuantity > 0;
    return true;
  });

  const count = segment === 'tools' ? filtered.length : (stockItems ?? []).length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Empréstimos</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => router.push('/(app)/tools/my-borrows')}
          activeOpacity={0.8}
          accessibilityLabel="Minhas retiradas"
        >
          <MaterialIcons name="visibility" size={22} color={Colors.primary} />
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

      {/* Tool filter chips (tools segment only) */}
      {segment === 'tools' && (
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
                  style={[
                    styles.chipText,
                    selected === f.key && styles.chipTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* List */}
      {segment === 'tools' ? (
        <>
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>Erro ao carregar ferramentas</Text>
              <TouchableOpacity onPress={refetch}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            key="tools-list"
            style={styles.list}
            data={filtered}
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
                  <MaterialIcons name="build" size={64} color={Colors.textMuted} />
                  <Text style={styles.emptyText}>Nenhuma ferramenta encontrada</Text>
                </View>
              ) : null
            }
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <>
          {stockError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>Erro ao carregar estoque</Text>
              <TouchableOpacity onPress={refetchStock}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            key="stock-list"
            style={styles.list}
            data={stockItems ?? []}
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
            ListHeaderComponent={
              isLoadingStock ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color={Colors.primary} />
                </View>
              ) : null
            }
            ListEmptyComponent={
              !isLoadingStock ? (
                <View style={styles.empty}>
                  <MaterialIcons name="inventory" size={64} color={Colors.textMuted} />
                  <Text style={styles.emptyText}>Nenhum item encontrado</Text>
                </View>
              ) : null
            }
            showsVerticalScrollIndicator={false}
          />
        </>
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
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
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
  eyeBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
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
