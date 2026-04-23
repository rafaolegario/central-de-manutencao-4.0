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
import UserCard from '@/components/UserCard';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/services/users/useUsers';
import type { User } from '@/types/api';

type FilterOption = 'all' | 'Admin' | 'Technician' | 'active' | 'inactive';

const FILTERS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'Admin', label: 'Administradores' },
  { key: 'Technician', label: 'Técnicos' },
  { key: 'active', label: 'Ativos' },
  { key: 'inactive', label: 'Inativos' },
];

export default function UsersScreen() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<FilterOption>('all');

  const { data: users, isLoading, error, refetch } = useUsers();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const filtered = (users ?? []).filter((u) => {
    if (selected === 'all') return true;
    if (selected === 'Admin') return u.role === 'Admin';
    if (selected === 'Technician') return u.role === 'Technician';
    if (selected === 'active') return u.active;
    if (selected === 'inactive') return !u.active;
    return true;
  });

  const activeCount = (users ?? []).filter((u) => u.active).length;

  const canTap = (u: User): boolean => {
    if (currentUser?.role === 'Admin') return true;
    return u.id === currentUser?.id;
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Usuários</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{activeCount} ativos</Text>
          </View>
        </View>
        {currentUser?.role === 'Admin' && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/(app)/users/create')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="person-add" size={20} color={Colors.white} />
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

      {/* List */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Erro ao carregar usuários</Text>
          <TouchableOpacity onPress={refetch}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <UserCard
              user={item}
              disabled={!canTap(item)}
              onPress={() =>
                router.push({ pathname: '/(app)/users/[id]', params: { id: item.id } })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialIcons name="people-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
});
