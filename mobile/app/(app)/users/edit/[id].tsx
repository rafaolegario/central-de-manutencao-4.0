import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SPECIALTY_LABELS } from '@/constants/labels';
import { useEditUser, useUser } from '@/services/users/useUsers';
import type { UserSpecialty } from '@/types/api';

const SPECIALTIES: UserSpecialty[] = [
  'Eletrician',
  'Mechanic',
  'Electromechanic',
  'General',
];

export default function EditUserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const { data: targetUser, isLoading, error } = useUser(id);
  const { mutate: editUser, isLoading: isSubmitting, error: apiError } = useEditUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState<UserSpecialty>('General');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!targetUser) return;
    setName(targetUser.name);
    setEmail(targetUser.email);
    setSpecialty((targetUser.specialty as UserSpecialty) ?? 'General');
  }, [targetUser]);

  if (currentUser?.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas administradores podem editar usuários.
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

  if (error || !targetUser) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.restrictedTitle}>Usuário não encontrado</Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nome é obrigatório.';
    if (!email.trim()) e.email = 'E-mail é obrigatório.';
    else if (!email.includes('@')) e.email = 'E-mail inválido.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await editUser({
        id: targetUser.id,
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          specialty,
        },
      });
      showSuccess('Usuário atualizado com sucesso.');
      router.back();
    } catch {
      showError(apiError?.errors?.[0] ?? 'Não foi possível atualizar o usuário.');
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
            label="Nome Completo *"
            value={name}
            onChangeText={setName}
            placeholder="Ex: João da Silva"
            leftIcon="person"
            error={errors.name}
          />

          <View style={styles.gap} />

          <AppInput
            label="E-mail *"
            value={email}
            onChangeText={setEmail}
            placeholder="joao.silva@empresa.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="email"
            error={errors.email}
          />

          <View style={styles.gap} />

          <Text style={styles.fieldLabel}>Especialidade *</Text>
          <View style={styles.specialtyRow}>
            {SPECIALTIES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.specialtyChip,
                  specialty === s && styles.specialtyChipActive,
                ]}
                onPress={() => setSpecialty(s)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.specialtyChipText,
                    specialty === s && styles.specialtyChipTextActive,
                  ]}
                >
                  {SPECIALTY_LABELS[s]}
                </Text>
              </TouchableOpacity>
            ))}
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
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  specialtyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  specialtyChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  specialtyChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  specialtyChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
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
