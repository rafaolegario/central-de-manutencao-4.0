import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { useToast } from '@/context/ToastContext';
import { useConsumeStock, useStockItem } from '@/services/stock/useStock';

export default function ConsumeStockScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const { data: item, isLoading: isLoadingItem } = useStockItem(id);
  const { mutate: consume, isLoading: isSubmitting, error: apiError } = useConsumeStock();

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
    } else if (qty > item.quantity) {
      e.quantity = `Disponível: ${item.quantity} un.`;
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      const updated = await consume({ id: item.id, data: { quantity, note: note.trim() || undefined } });
      showSuccess(`Item retirado. Restam ${updated.quantity} unidades.`);
      router.back();
    } catch {
      showError(apiError?.errors?.[0] ?? 'Não foi possível retirar o item.');
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
                Disponível: {item.quantity} un.
              </Text>
            </View>
          </View>

          <View style={styles.gap} />

          <AppInput
            label="Quantidade a retirar *"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Ex: 5"
            leftIcon="remove"
            keyboardType="numeric"
            error={errors.quantity}
          />

          <View style={styles.gap} />

          <AppInput
            label="Observação"
            value={note}
            onChangeText={setNote}
            placeholder="Ex: Para a OS do Galpão A"
            leftIcon="notes"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={styles.multiline}
          />

          <View style={styles.gapLg} />

          <AppButton
            label="Confirmar Retirada"
            icon="output"
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
});
