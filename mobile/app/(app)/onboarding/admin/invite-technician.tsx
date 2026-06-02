import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { SPECIALTY_LABELS } from '@/constants/labels';
import { useCreateUser } from '@/services/users/useUsers';
import type { UserSpecialty } from '@/types/api';

const SPECIALTIES: UserSpecialty[] = [
  'Eletrician',
  'Mechanic',
  'Electromechanic',
  'General',
];

export default function OnboardingInviteTechnicianScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState<UserSpecialty>('General');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createUser, isLoading, error: apiError } = useCreateUser();

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nome é obrigatório.';
    if (!email.trim()) e.email = 'E-mail é obrigatório.';
    else if (!email.includes('@')) e.email = 'E-mail inválido.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => router.replace('/(app)/onboarding/admin/completed');

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createUser({ name, email, specialty });
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
          <Text style={styles.stepLabel}>Passo 3 de 3</Text>
          <Text style={styles.title}>Convide seu primeiro técnico</Text>
          <Text style={styles.subtitle}>
            O técnico receberá um convite e definirá a senha no primeiro
            acesso usando este e-mail.
          </Text>

          <View style={styles.divider} />

          <AppInput
            label="Nome completo *"
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

          {apiError ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>
                {apiError.errors?.[0] ?? 'Erro ao criar o usuário.'}
              </Text>
            </View>
          ) : null}

          <View style={styles.gapLg} />

          <AppButton
            label="Convidar e finalizar"
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
