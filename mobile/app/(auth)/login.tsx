import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
import AccountDisabledDialog from '@/components/AccountDisabledDialog';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login, checkEmail } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountDisabled, setAccountDisabled] = useState(false);

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setError('Informe o e-mail.');
      return;
    }
    setError('');
    setIsLoading(true);
    const result = await checkEmail(email);
    setIsLoading(false);

    if (!result.success || !result.data) {
      setError(result.error ?? 'Erro ao verificar o e-mail.');
      return;
    }

    const { exists, mustSetPassword, anyAdminExists: hasAdmins } = result.data;

    if (!exists && !hasAdmins) {
      router.push({
        pathname: '/(auth)/register',
        params: { email: email.trim().toLowerCase() },
      });
      return;
    }

    if (!exists) {
      setError('E-mail não encontrado. Verifique com o administrador.');
      return;
    }

    if (mustSetPassword) {
      router.push({
        pathname: '/(auth)/set-password',
        params: { email: email.trim().toLowerCase() },
      });
      return;
    }

    setStep('password');
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setError('Informe a senha.');
      return;
    }
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (!result.success) {
      const msg = result.error ?? 'Erro ao fazer login.';
      if (msg.toLowerCase().includes('inativo')) {
        setAccountDisabled(true);
      } else {
        setError(msg);
      }
    }
    // On success, root layout handles redirect.
  };

  const goBackToEmail = () => {
    setStep('email');
    setPassword('');
    setError('');
  };

  const goToRegister = () => {
    router.push({
      pathname: '/(auth)/register',
      params: { email: email.trim().toLowerCase() },
    });
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
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="build" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Central de Manutenção</Text>
            <Text style={styles.subtitle}>
              {step === 'email'
                ? 'Entre com seu e-mail para continuar'
                : 'Informe sua senha para continuar'}
            </Text>
          </View>

          <View style={styles.form}>
            {step === 'email' ? (
              <>
                <AppInput
                  label="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftIcon="email"
                  placeholder="seu@email.com"
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.spacerLg} />

                <AppButton
                  label="Continuar"
                  onPress={handleEmailSubmit}
                  loading={isLoading}
                  fullWidth
                  size="lg"
                />

                <TouchableOpacity
                  style={styles.firstSetupLink}
                  onPress={goToRegister}
                  accessibilityRole="link"
                  accessibilityLabel="Criar conta de administrador"
                >
                  <Text style={styles.firstSetupLinkText}>
                    Primeira configuração? Criar conta de administrador
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={goBackToEmail} style={styles.backRow}>
                  <MaterialIcons name="arrow-back" size={18} color={Colors.primary} />
                  <Text style={styles.backText}>Trocar e-mail</Text>
                </TouchableOpacity>

                <View style={styles.spacer} />

                <AppInput
                  label="E-mail"
                  value={email}
                  editable={false}
                  leftIcon="email"
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
                  placeholder="••••••"
                  autoFocus
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.spacerLg} />

                <AppButton
                  label="Entrar"
                  onPress={handlePasswordSubmit}
                  loading={isLoading}
                  fullWidth
                  size="lg"
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AccountDisabledDialog
        visible={accountDisabled}
        onClose={() => setAccountDisabled(false)}
      />
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
    paddingTop: 64,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
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
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 12,
  },
  firstSetupLink: {
    marginTop: 24,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  firstSetupLinkText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
