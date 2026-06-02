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
import { useCreateTool } from '@/services/tools/useTools';

export default function OnboardingAddToolScreen() {
  const router = useRouter();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createTool, isLoading, error: apiError } = useCreateTool();

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!code.trim()) e.code = 'Código é obrigatório.';
    if (!name.trim()) e.name = 'Nome é obrigatório.';
    const qty = parseInt(totalQuantity, 10);
    if (!totalQuantity.trim()) e.totalQuantity = 'Quantidade é obrigatória.';
    else if (isNaN(qty) || qty <= 0)
      e.totalQuantity = 'Deve ser um número inteiro positivo.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => router.replace('/(app)/onboarding/admin/add-stock');

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createTool({ code: code.trim(), name: name.trim(), totalQuantity });
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
          <Text style={styles.stepLabel}>Passo 1 de 3</Text>
          <Text style={styles.title}>Cadastre sua primeira ferramenta</Text>
          <Text style={styles.subtitle}>
            Ferramentas são os equipamentos retirados pelos técnicos para
            executar uma ordem de serviço.
          </Text>

          <View style={styles.divider} />

          <AppInput
            label="Código *"
            value={code}
            onChangeText={setCode}
            placeholder="Ex: MLT-DIG-01"
            leftIcon="qr-code-2"
            autoCapitalize="characters"
            error={errors.code}
          />

          <View style={styles.gap} />

          <AppInput
            label="Nome *"
            value={name}
            onChangeText={setName}
            placeholder="Ex: Multímetro Digital"
            leftIcon="build"
            error={errors.name}
          />

          <View style={styles.gap} />

          <AppInput
            label="Quantidade total *"
            value={totalQuantity}
            onChangeText={setTotalQuantity}
            placeholder="Ex: 5"
            leftIcon="inventory-2"
            keyboardType="numeric"
            error={errors.totalQuantity}
          />

          {apiError ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>
                {apiError.errors?.[0] ?? 'Erro ao cadastrar a ferramenta.'}
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
