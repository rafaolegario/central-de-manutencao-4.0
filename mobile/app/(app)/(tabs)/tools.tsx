import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ToolCard from '@/components/ToolCard';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  MOCK_TOOLS,
  MockTool,
  getActiveUsagesForTechnician,
} from '@/data/mock';

type ToolFilter = 'all' | 'available' | 'mine';

const FILTERS: { key: ToolFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'available', label: 'Disponíveis' },
  { key: 'mine', label: 'Minhas retiradas' },
];

export default function TechnicianToolsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [selected, setSelected] = useState<ToolFilter>('all');

  const [, setRefreshTick] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setRefreshTick((n) => n + 1);
    }, [])
  );

  const mineToolIds = user
    ? new Set(getActiveUsagesForTechnician(user.id).map((u) => u.toolId))
    : new Set<string>();

  const filtered: MockTool[] = MOCK_TOOLS.filter((t) => {
    if (selected === 'available') return t.availableQuantity > 0;
    if (selected === 'mine') return mineToolIds.has(t.id);
    return true;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Ferramentas</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filtered.length}</Text>
          </View>
        </View>
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

      {/* List */}
      <FlatList
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
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="build" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma ferramenta encontrada</Text>
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
