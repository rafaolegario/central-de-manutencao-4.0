import { Redirect, Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontWeight: '700', color: Colors.textPrimary },
        headerShadowVisible: false,
        headerBackVisible: true,
        headerBackTitle: '',
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
      <Stack.Screen
        name="tools/[id]"
        options={{ headerShown: true, title: 'Ferramenta' }}
      />
      <Stack.Screen
        name="tools/create"
        options={{ headerShown: true, title: 'Nova Ferramenta' }}
      />
      <Stack.Screen
        name="tools/withdraw"
        options={{ headerShown: true, title: 'Retirar Ferramenta' }}
      />
      <Stack.Screen
        name="stock/[id]"
        options={{ headerShown: true, title: 'Item de Estoque' }}
      />
      <Stack.Screen
        name="stock/create"
        options={{ headerShown: true, title: 'Novo Item' }}
      />
      <Stack.Screen
        name="stock/replenish"
        options={{ headerShown: true, title: 'Reabastecer' }}
      />
      <Stack.Screen
        name="stock/movements"
        options={{ headerShown: true, title: 'Movimentações' }}
      />
    </Stack>
  );
}
