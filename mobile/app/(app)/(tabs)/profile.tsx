import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/AppButton';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS, SPECIALTY_LABELS } from '@/constants/labels';
import { MOCK_SERVICE_ORDERS } from '@/data/mock';
import { getInitials } from '@/utils/format';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = getInitials(user.name);

  const ordersCreated = MOCK_SERVICE_ORDERS.filter(
    (o) => o.createdBy === user.id
  ).length;
  const ordersAssigned = MOCK_SERVICE_ORDERS.filter(
    (o) => o.technicianId === user.id
  ).length;

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Perfil</Text>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{ROLE_LABELS[user.role]}</Text>
            </View>
            {user.specialty && (
              <View style={styles.specialtyBadge}>
                <Text style={styles.specialtyBadgeText}>
                  {SPECIALTY_LABELS[user.specialty]}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <InfoRow icon="email" label="E-mail" value={user.email} />
          <View style={styles.divider} />
          <InfoRow icon="badge" label="ID" value={user.id} mono />
          <View style={styles.divider} />
          <InfoRow icon="shield" label="Função" value={ROLE_LABELS[user.role]} />
        </View>

        {/* Stats card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Atividade</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{ordersCreated}</Text>
              <Text style={styles.statLabel}>Ordens criadas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{ordersAssigned}</Text>
              <Text style={styles.statLabel}>Atribuídas a mim</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <AppButton
          label="Sair da Conta"
          icon="logout"
          onPress={handleLogout}
          variant="danger"
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={infoStyles.row}>
      <MaterialIcons name={icon} size={16} color={Colors.textMuted} style={infoStyles.icon} />
      <Text style={infoStyles.label}>{label}</Text>
      <Text
        style={[infoStyles.value, mono && infoStyles.mono]}
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        {value}
      </Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  mono: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  profileCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Colors.radiusXl,
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 12,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  roleBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  specialtyBadge: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  specialtyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: Colors.radiusLg,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: Colors.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
});
