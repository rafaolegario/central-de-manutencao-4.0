import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const { registerFirstAdmin } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState(params.email ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Informe seu nome.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    setError('');
    setIsLoading(true);
    const result = await registerFirstAdmin({ name, email, password });
    setIsLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Não foi possível criar a conta.');
    }
    // On success, root navigator routes into admin onboarding wizard.
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backRow}
          >
            <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialIcons
                name="admin-panel-settings"
                size={36}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.title}>Configuração inicial</Text>
            <Text style={styles.subtitle}>
              Crie a conta do administrador para começar a usar o sistema.
            </Text>
          </View>

          <View style={styles.banner}>
            <MaterialIcons name="info-outline" size={18} color={Colors.primary} />
            <Text style={styles.bannerText}>
              Este passo só está disponível quando ainda não existe nenhum
              administrador cadastrado.
            </Text>
          </View>

          <View style={styles.spacer} />

          <View style={styles.form}>
            <AppInput
              label="Nome completo"
              value={name}
              onChangeText={setName}
              placeholder="Ex: Maria Souza"
              leftIcon="person"
              autoCapitalize="words"
            />

            <View style={styles.spacer} />

            <AppInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="email"
              placeholder="admin@empresa.com"
            />

            <View style={styles.spacer} />

            <AppInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowPassword((v) => !v)}
              placeholder="Mínimo 6 caracteres"
            />

            <View style={styles.spacer} />

            <AppInput
              label="Confirmar senha"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showPassword}
              leftIcon="lock"
              placeholder="Repita a senha"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.spacerLg} />

            <AppButton
              label="Criar conta de administrador"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              size="lg"
            />
          </View>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 40,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  backText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: Colors.radiusMd,
    padding: 12,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    lineHeight: 18,
  },
  form: {
    gap: 0,
  },
  spacer: {
    height: 16,
  },
  spacerLg: {
    height: 24,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 12,
  },
});
