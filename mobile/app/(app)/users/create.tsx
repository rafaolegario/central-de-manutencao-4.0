import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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
import { SPECIALTY_LABELS, UserSpecialty } from '@/data/mock';

const SPECIALTIES: UserSpecialty[] = [
  'Eletrician',
  'Mechanic',
  'Electromechanic',
  'General',
];

export default function CreateUserScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [specialty, setSpecialty] = useState<UserSpecialty>('General');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (user?.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas administradores podem criar usuários.
          </Text>
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
    if (!password) e.password = 'Senha é obrigatória.';
    else if (password.length < 6) e.password = 'Senha deve ter ao menos 6 caracteres.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    // TODO: POST to API and update local state
    await new Promise((r) => setTimeout(r, 700));
    setIsSubmitting(false);
    Alert.alert('Sucesso', 'Usuário criado com sucesso!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
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
          {/* Role info */}
          <View style={styles.roleInfo}>
            <Text style={styles.roleInfoText}>Função: Técnico</Text>
          </View>

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

          <AppInput
            label="Senha *"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon="lock"
            rightIcon={showPassword ? 'visibility-off' : 'visibility'}
            onRightIconPress={() => setShowPassword((v) => !v)}
            placeholder="Mínimo 6 caracteres"
            error={errors.password}
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

          <View style={styles.gapLg} />

          <AppButton
            label="Criar Usuário"
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
  roleInfo: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Colors.radiusMd,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  roleInfoText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
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
