import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontWeight: '700', color: Colors.textPrimary },
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="orders/[id]"
        options={{ headerShown: true, title: 'Ordem de Serviço' }}
      />
      <Stack.Screen
        name="orders/create"
        options={{ headerShown: true, title: 'Nova Ordem' }}
      />
      <Stack.Screen
        name="users/[id]"
        options={{ headerShown: true, title: 'Usuário' }}
      />
      <Stack.Screen
        name="users/create"
        options={{ headerShown: true, title: 'Novo Usuário' }}
      />
    </Stack>
  );
}
