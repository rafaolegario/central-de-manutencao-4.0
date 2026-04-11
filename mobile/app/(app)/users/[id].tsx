import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/AppButton';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  formatDate,
  getInitials,
  getUserById,
  MOCK_SERVICE_ORDERS,
  MockUser,
  ROLE_LABELS,
  SPECIALTY_LABELS,
} from '@/data/mock';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [targetUser, setTargetUser] = useState<MockUser | undefined>(getUserById(id));

  const canView =
    currentUser?.role === 'Admin' || currentUser?.id === id;

  if (!canView) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.centered}>
          <MaterialIcons name="lock" size={64} color={Colors.textMuted} />
          <Text style={styles.centeredTitle}>Acesso negado</Text>
          <Text style={styles.centeredSub}>
            Você não tem permissão para visualizar este perfil.
          </Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  if (!targetUser) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.centered}>
          <MaterialIcons name="person-off" size={64} color={Colors.textMuted} />
          <Text style={styles.centeredTitle}>Usuário não encontrado</Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  const initials = getInitials(targetUser.name);
  const assignedOrders = MOCK_SERVICE_ORDERS.filter(
    (o) => o.technicianId === targetUser.id
  );

  const handleToggleActive = () => {
    const action = targetUser.active ? 'desativar' : 'ativar';
    Alert.alert(
      `${targetUser.active ? 'Desativar' : 'Ativar'} usuário`,
      `Tem certeza que deseja ${action} ${targetUser.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // TODO: PATCH to API
            setTargetUser({ ...targetUser, active: !targetUser.active });
            Alert.alert(
              'Atualizado',
              `Usuário ${targetUser.active ? 'desativado' : 'ativado'} com sucesso.`
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{targetUser.name}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{ROLE_LABELS[targetUser.role]}</Text>
            </View>
            {targetUser.specialty !== 'General' && (
              <View style={styles.specialtyBadge}>
                <Text style={styles.specialtyBadgeText}>
                  {SPECIALTY_LABELS[targetUser.specialty]}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: targetUser.active
                    ? Colors.success
                    : Colors.textMuted,
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: targetUser.active ? Colors.success : Colors.textMuted },
              ]}
            >
              {targetUser.active ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <InfoRow icon="email" label="E-mail" value={targetUser.email} />
          <View style={styles.divider} />
          <InfoRow icon="badge" label="ID" value={targetUser.id} mono />
          <View style={styles.divider} />
          <InfoRow label="Criado em" icon="calendar-today" value={formatDate(targetUser.createdAt)} />
        </View>

        {/* Orders summary */}
        {assignedOrders.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Ordens Atribuídas ({assignedOrders.length})
            </Text>
            {assignedOrders.map((o) => (
              <View key={o.id} style={styles.orderRow}>
                <View style={styles.orderDot} />
                <Text style={styles.orderTitle} numberOfLines={1}>
                  {o.title}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Admin actions */}
        {currentUser?.role === 'Admin' && (
          <View style={styles.actions}>
            <AppButton
              label="Editar Usuário"
              icon="edit"
              variant="secondary"
              onPress={() =>
                Alert.alert('Em breve', 'Função de edição em desenvolvimento.')
              }
              fullWidth
            />
            <AppButton
              label={targetUser.active ? 'Desativar Usuário' : 'Ativar Usuário'}
              icon={targetUser.active ? 'person-off' : 'person'}
              variant={targetUser.active ? 'danger' : 'primary'}
              onPress={handleToggleActive}
              fullWidth
            />
          </View>
        )}
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
    fontSize: 11,
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
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  centeredTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  centeredSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  orderTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  actions: {
    gap: 10,
    marginTop: 4,
  },
});
