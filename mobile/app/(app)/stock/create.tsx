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
import { useCreateStockItem } from '@/services/stock/useStock';

export default function CreateStockScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const { mutate: createStockItem, isLoading: isSubmitting, error: apiError } = useCreateStockItem();
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (user?.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas administradores podem cadastrar itens de estoque.
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
    const qty = parseInt(quantity, 10);
    const min = parseInt(minQuantity, 10);
    if (!quantity.trim()) {
      e.quantity = 'Quantidade é obrigatória.';
    } else if (isNaN(qty) || qty < 0) {
      e.quantity = 'Deve ser um inteiro ≥ 0.';
    }
    if (!minQuantity.trim()) {
      e.minQuantity = 'Mínimo é obrigatório.';
    } else if (isNaN(min) || min < 0) {
      e.minQuantity = 'Deve ser um inteiro ≥ 0.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createStockItem({ code, name, quantity, minQuantity });
      Alert.alert('Sucesso', 'Item de estoque cadastrado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erro', apiError?.message ?? 'Não foi possível cadastrar o item.');
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

          <View style={styles.gapLg} />

          <AppButton
            label="Cadastrar Item"
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
