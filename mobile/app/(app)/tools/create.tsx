import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { useCreateTool } from '@/services/tools/useTools';

export default function CreateToolScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createTool, isLoading: isSubmitting, error: apiError } = useCreateTool();

  if (user?.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas administradores podem cadastrar ferramentas.
          </Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!code.trim()) e.code = 'Código é obrigatório.';
    if (!name.trim()) e.name = 'Nome é obrigatório.';
    const qty = parseInt(totalQuantity, 10);
    if (!totalQuantity.trim()) {
      e.totalQuantity = 'Quantidade é obrigatória.';
    } else if (isNaN(qty) || qty <= 0) {
      e.totalQuantity = 'Deve ser um número inteiro positivo.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createTool({ code: code.trim(), name: name.trim(), totalQuantity });
      Alert.alert('Sucesso', 'Ferramenta cadastrada com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      // error surfaced via apiError
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

          {apiError && (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>
                {apiError.errors?.[0] ?? 'Erro ao cadastrar ferramenta. Tente novamente.'}
              </Text>
            </View>
          )}

          <View style={styles.gapLg} />

          <AppButton
            label="Cadastrar Ferramenta"
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
  gap: {
    height: 16,
  },
  gapLg: {
    height: 24,
  },
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
