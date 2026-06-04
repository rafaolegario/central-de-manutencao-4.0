import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { HapticTab } from '@/components/haptic-tab';
import { useAuth } from '@/context/AuthContext';
import { getOnboardingDismissed } from '@/services/onboarding/onboardingStorage';
import {
  pickFirstIncompleteStep,
  useOnboardingStatus,
} from '@/services/onboarding/useOnboarding';

export default function TabsLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [dismissed, setDismissed] = useState<boolean | null>(null);
  useEffect(() => {
    let cancelled = false;
    getOnboardingDismissed().then((v) => {
      if (!cancelled) setDismissed(v);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const status = useOnboardingStatus(isAdmin);

  // Admin onboarding gate
  if (isAdmin) {
    if (dismissed === null || status.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    if (status.data && !status.data.complete && !dismissed) {
      const next = pickFirstIncompleteStep(status.data);
      return <Redirect href={`/(app)/onboarding/admin/${next}`} />;
    }
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Painel',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Ordens',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="assignment" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Usuários',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="people" size={24} color={color} />
          ),
          href: isAdmin ? '/(app)/(tabs)/users' : null,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventário',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="inventory-2" size={24} color={color} />
          ),
          href: isAdmin ? '/(app)/(tabs)/inventory' : null,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Empréstimos',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="build" size={24} color={color} />
          ),
          href: isAdmin ? null : '/(app)/(tabs)/tools',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
