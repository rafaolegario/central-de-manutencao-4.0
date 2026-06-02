import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/AppButton';
import { Colors } from '@/constants/theme';
import { setOnboardingDismissed } from '@/services/onboarding/onboardingStorage';

export default function OnboardingCompletedScreen() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await setOnboardingDismissed();
      if (cancelled) return;
      const timer = setTimeout(() => {
        router.replace('/(app)/(tabs)');
      }, 2500);
      return () => clearTimeout(timer);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const goNow = async () => {
    await setOnboardingDismissed();
    router.replace('/(app)/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="check-circle" size={64} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Tudo pronto!</Text>
        <Text style={styles.subtitle}>
          Sua Central de Manutenção está configurada e pronta para uso.
          Você pode adicionar mais ferramentas, itens e usuários a qualquer
          momento pelos menus do app.
        </Text>

        <View style={styles.spacerLg} />

        <AppButton label="Ir para o painel" onPress={goNow} fullWidth size="lg" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  spacerLg: {
    height: 40,
  },
});
