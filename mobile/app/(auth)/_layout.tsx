import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Redirect href="/(app)/(tabs)/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
