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

export default function SetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email ?? '';

  const { setFirstPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
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
    const result = await setFirstPassword(email, password);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Não foi possível definir a senha.');
    }
    // On success, root layout redirects to the app.
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
              <MaterialIcons name="lock" size={36} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>
              Vamos criar sua senha de acesso para {email}
            </Text>
          </View>

          <View style={styles.form}>
            <AppInput
              label="Nova senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowPassword((v) => !v)}
              placeholder="Mínimo 6 caracteres"
              autoFocus
            />

            <View style={styles.spacer} />

            <AppInput
              label="Confirmar senha"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showConfirm}
              leftIcon="lock"
              rightIcon={showConfirm ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowConfirm((v) => !v)}
              placeholder="Repita a senha"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.spacerLg} />

            <AppButton
              label="Definir senha e entrar"
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
    marginBottom: 32,
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
