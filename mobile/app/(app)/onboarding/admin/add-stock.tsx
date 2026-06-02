import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { useCreateStockItem } from '@/services/stock/useStock';

export default function OnboardingAddStockScreen() {
  const router = useRouter();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createStockItem, isLoading, error: apiError } = useCreateStockItem();

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!code.trim()) e.code = 'Código é obrigatório.';
    if (!name.trim()) e.name = 'Nome é obrigatório.';
    const qty = parseInt(quantity, 10);
    const min = parseInt(minQuantity, 10);
    if (!quantity.trim()) e.quantity = 'Quantidade é obrigatória.';
    else if (isNaN(qty) || qty < 0) e.quantity = 'Deve ser um inteiro ≥ 0.';
    if (!minQuantity.trim()) e.minQuantity = 'Mínimo é obrigatório.';
    else if (isNaN(min) || min < 0) e.minQuantity = 'Deve ser um inteiro ≥ 0.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () =>
    router.replace('/(app)/onboarding/admin/invite-technician');

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createStockItem({ code, name, quantity, minQuantity });
      goNext();
    } catch {
      // apiError surfaced below
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.stepLabel}>Passo 2 de 3</Text>
          <Text style={styles.title}>Cadastre seu primeiro item de estoque</Text>
          <Text style={styles.subtitle}>
            Itens de estoque são peças e insumos consumidos durante as
            manutenções.
          </Text>

          <View style={styles.divider} />

          <AppInput
            label="Código *"
            value={code}
            onChangeText={setCode}
            placeholder="Ex: BRG-6205"
            leftIcon="qr-code-2"
            autoCapitalize="characters"
            error={errors.code}
          />

          <View style={styles.gap} />

          <AppInput
            label="Nome *"
            value={name}
            onChangeText={setName}
            placeholder="Ex: Rolamento SKF 6205-2RS"
            leftIcon="inventory"
            error={errors.name}
          />

          <View style={styles.gap} />

          <AppInput
            label="Quantidade inicial *"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Ex: 20"
            leftIcon="inventory-2"
            keyboardType="numeric"
            error={errors.quantity}
          />

          <View style={styles.gap} />

          <AppInput
            label="Quantidade mínima *"
            value={minQuantity}
            onChangeText={setMinQuantity}
            placeholder="Ex: 5"
            leftIcon="warning-amber"
            keyboardType="numeric"
            error={errors.minQuantity}
          />

          {apiError ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>
                {apiError.errors?.[0] ?? 'Erro ao cadastrar o item.'}
              </Text>
            </View>
          ) : null}

          <View style={styles.gapLg} />

          <AppButton
            label="Cadastrar e continuar"
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            size="lg"
          />

          <View style={styles.gap} />

          <AppButton
            label="Pular esta etapa"
            onPress={goNext}
            variant="ghost"
            fullWidth
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  kav: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },
  gap: { height: 16 },
  gapLg: { height: 24 },
  apiErrorBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: Colors.radiusLg,
  },
  apiErrorText: {
    fontSize: 13,
    color: '#991B1B',
  },
});
