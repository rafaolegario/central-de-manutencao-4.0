import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/AppButton';
import MetaRow from '@/components/MetaRow';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useStockItem } from '@/services/stock/useStock';
import { formatDate } from '@/utils/format';

export default function StockDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const { data: item, isLoading, error, refetch } = useStockItem(id);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (user?.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas administradores podem acessar o estoque.
          </Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !item) {
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

  const low = item.isLow;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={[styles.iconWrap, low && styles.iconWrapLow]}>
            <MaterialIcons
              name="inventory"
              size={28}
              color={low ? Colors.error : Colors.primary}
            />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={styles.code}>{item.code}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </View>

        {low && (
          <View style={styles.lowAlert}>
            <MaterialIcons name="warning-amber" size={18} color={Colors.error} />
            <Text style={styles.lowAlertText}>
              Estoque abaixo do mínimo estabelecido.
            </Text>
          </View>
        )}

        {/* Quantity card */}
        <View style={styles.qtyCard}>
          <View style={styles.qtyBlock}>
            <Text style={styles.qtyLabel}>Em estoque</Text>
            <Text style={[styles.qtyValue, low && { color: Colors.error }]}>
              {item.quantity}
            </Text>
          </View>
          <View style={styles.qtyDivider} />
          <View style={styles.qtyBlock}>
            <Text style={styles.qtyLabel}>Mínimo</Text>
            <Text style={styles.qtyValueSm}>{item.minQuantity}</Text>
          </View>
        </View>

        {/* Metadata */}
        <View style={styles.card}>
          <MetaRow label="Código" value={item.code} labelWidth={130} />
          <View style={styles.cardDivider} />
          <MetaRow label="Nome" value={item.name} labelWidth={130} />
          <View style={styles.cardDivider} />
          <MetaRow label="Cadastrado em" value={formatDate(item.createdAt)} labelWidth={130} />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <AppButton
            label="Reabastecer"
            icon="add-box"
            variant="primary"
            onPress={() =>
              router.push({
                pathname: '/(app)/stock/replenish',
                params: { id: item.id },
              })
            }
            fullWidth
          />
          <AppButton
            label="Ver movimentações"
            icon="history"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: '/(app)/stock/movements',
                params: { id: item.id },
              })
            }
            fullWidth
          />
          <AppButton
            label="Editar item"
            icon="edit"
            variant="ghost"
            onPress={() =>
              Alert.alert('Em breve', 'Função de edição em desenvolvimento.')
            }
            fullWidth
          />
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapLow: {
    backgroundColor: Colors.errorLight,
  },
  headerTextCol: {
    flex: 1,
  },
  code: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  lowAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: Colors.radiusMd,
    backgroundColor: Colors.errorLight,
    marginTop: 16,
  },
  lowAlertText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.error,
    flex: 1,
  },
  qtyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: Colors.radiusLg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 16,
  },
  qtyBlock: {
    flex: 1,
    alignItems: 'center',
  },
  qtyLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  qtyValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  qtyValueSm: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  qtyDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.border,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Colors.radiusLg,
    paddingHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  actions: {
    marginTop: 24,
    gap: 10,
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
