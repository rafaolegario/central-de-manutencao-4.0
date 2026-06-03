import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useEditTool, useTool } from '@/services/tools/useTools';

export default function EditToolScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const { data: tool, isLoading, error } = useTool(id);
  const { mutate: editTool, isLoading: isSubmitting, error: apiError } = useEditTool();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!tool) return;
    setCode(tool.code);
    setName(tool.name);
  }, [tool]);

  if (user?.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas administradores podem editar ferramentas.
          </Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !tool) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.restrictedTitle}>Ferramenta não encontrada</Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!code.trim()) e.code = 'Código é obrigatório.';
    if (!name.trim()) e.name = 'Nome é obrigatório.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await editTool({
        id: tool.id,
        data: { code: code.trim(), name: name.trim() },
      });
      showSuccess('Ferramenta atualizada com sucesso.');
      router.back();
    } catch {
      showError(apiError?.errors?.[0] ?? 'Não foi possível atualizar a ferramenta.');
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

          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              A quantidade total não é editável aqui — para registrar adições ou
              remoções, use os fluxos de retirada e devolução.
            </Text>
          </View>

          {apiError && (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>
                {apiError.errors?.[0] ?? 'Erro ao salvar alterações.'}
              </Text>
            </View>
          )}

          <View style={styles.gapLg} />

          <AppButton
            label="Salvar Alterações"
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  gap: {
    height: 16,
  },
  gapLg: {
    height: 24,
  },
  banner: {
    backgroundColor: Colors.surface,
    borderRadius: Colors.radiusMd,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bannerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
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
