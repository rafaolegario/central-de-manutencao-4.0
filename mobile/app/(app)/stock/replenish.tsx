import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useReplenishStock, useStockItem } from '@/services/stock/useStock';

export default function ReplenishStockScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const { data: item, isLoading: isLoadingItem } = useStockItem(id);
  const { mutate: replenish, isLoading: isSubmitting, error: apiError } = useReplenishStock();

  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isLoadingItem) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (user?.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas administradores podem reabastecer o estoque.
          </Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

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

  const handleSubmit = async () => {
    const qty = parseInt(quantity, 10);
    const e: Record<string, string> = {};
    if (!quantity.trim()) {
      e.quantity = 'Quantidade é obrigatória.';
    } else if (isNaN(qty) || qty <= 0) {
      e.quantity = 'Deve ser um inteiro positivo.';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      const updated = await replenish({ id: item.id, data: { quantity, note: note.trim() || undefined } });
      Alert.alert('Sucesso', `Estoque atualizado para ${updated.quantity} unidades.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erro', apiError?.message ?? 'Não foi possível reabastecer o estoque.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Item summary */}
          <View style={styles.itemCard}>
            <View style={styles.itemIcon}>
              <MaterialIcons name="inventory" size={24} color={Colors.primary} />
            </View>
            <View style={styles.itemTextCol}>
              <Text style={styles.itemCode}>{item.code}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQty}>
                Atual: {item.quantity} un. · Mín.: {item.minQuantity}
              </Text>
            </View>
          </View>

          <View style={styles.gap} />

          <AppInput
            label="Quantidade a adicionar *"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Ex: 10"
            leftIcon="add-box"
            keyboardType="numeric"
            error={errors.quantity}
          />

          <View style={styles.gap} />

          <AppInput
            label="Observação"
            value={note}
            onChangeText={setNote}
            placeholder="Ex: Nota fiscal 12345 — fornecedor XYZ"
            leftIcon="notes"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={styles.multiline}
          />

          <View style={styles.gapLg} />

          <AppButton
            label="Confirmar Reabastecimento"
            icon="add-box"
            onPress={handleSubmit}
            loading={isSubmitting}
            fullWidth
            size="lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  kav: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: Colors.radiusLg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTextCol: {
    flex: 1,
  },
  itemCode: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  itemQty: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  gap: {
    height: 16,
  },
  gapLg: {
    height: 24,
  },
  multiline: {
    minHeight: 80,
    paddingTop: 4,
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
