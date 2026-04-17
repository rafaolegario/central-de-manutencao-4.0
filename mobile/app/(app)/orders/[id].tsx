import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/AppButton';
import PriorityBadge from '@/components/PriorityBadge';
import StatusBadge from '@/components/StatusBadge';
import { Colors } from '@/constants/theme';
import { formatDate, formatDateTime } from '@/data/mock';
import { useAuth } from '@/context/AuthContext';
import { useOrder, useUpdateOrderStatus } from '@/services/orders/useOrders';
import { useUsers } from '@/services/users/useUsers';
import type { ServiceOrderStatus } from '@/types/api';

interface StatusLogEntry {
  id: string;
  serviceOrderId: string;
  oldStatus: ServiceOrderStatus;
  newStatus: ServiceOrderStatus;
  changedAt: string;
  changedBy: string;
  description: string | null;
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const { data: order, isLoading, error, refetch } = useOrder(id);
  const { data: usersData } = useUsers();
  const { mutate: updateStatus, isLoading: isCanceling } = useUpdateOrderStatus();

  const userMap: Record<string, string> = Object.fromEntries(
    (usersData ?? []).map((u) => [u.id, u.name])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <MaterialIcons name="search-off" size={64} color={Colors.textMuted} />
          <Text style={styles.notFoundText}>Ordem não encontrada</Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  const logs: StatusLogEntry[] = [];

  const canDelete =
    user?.role === 'Admin' &&
    order.status !== 'Canceled' &&
    order.status !== 'Approved';

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Ordem',
      'Tem certeza que deseja cancelar esta ordem de serviço?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateStatus({ id: order.id, data: { status: 'Canceled' } });
              refetch();
              Alert.alert('Cancelado', 'A ordem foi cancelada.');
            } catch {
              Alert.alert('Erro', 'Não foi possível cancelar a ordem.');
            }
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
        {/* Badges */}
        <View style={styles.badgeRow}>
          <PriorityBadge priority={order.priority} size="md" />
          <StatusBadge status={order.status} size="md" />
        </View>

        {/* Title */}
        <Text style={styles.title}>{order.title}</Text>

        {/* Location */}
        {order.location ? (
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={14} color={Colors.textMuted} />
            <Text style={styles.locationText}>{order.location}</Text>
          </View>
        ) : (
          <Text style={styles.locationEmpty}>Local não informado</Text>
        )}

        {/* Metadata card */}
        <View style={styles.card}>
          <MetaRow label="Criado em" value={formatDate(order.createdAt)} />
          <View style={styles.cardDivider} />
          <MetaRow label="Prazo" value={formatDate(order.dueDate) || 'Não definido'} />
          <View style={styles.cardDivider} />
          <MetaRow
            label="Técnico"
            value={order.technicianId ? (userMap[order.technicianId] ?? '—') : 'Não atribuído'}
          />
          <View style={styles.cardDivider} />
          <MetaRow
            label="Criado por"
            value={userMap[order.createdBy] ?? '—'}
          />
          {order.assignedBy && (
            <>
              <View style={styles.cardDivider} />
              <MetaRow
                label="Atribuído por"
                value={userMap[order.assignedBy] ?? '—'}
              />
            </>
          )}
        </View>

        {/* Description */}
        <View style={styles.descCard}>
          <Text style={styles.descLabel}>Descrição</Text>
          <Text style={styles.descText}>{order.description}</Text>
        </View>

        {/* Completion notes */}
        {order.completionNotes && (
          <View style={[styles.descCard, styles.notesCard]}>
            <Text style={styles.descLabel}>Observações de Conclusão</Text>
            <Text style={styles.descText}>{order.completionNotes}</Text>
          </View>
        )}

        {/* Status log */}
        <Text style={styles.sectionTitle}>Histórico de Status</Text>
        {logs.length === 0 ? (
          <Text style={styles.noLogs}>Nenhuma alteração registrada</Text>
        ) : (
          <View style={styles.timeline}>
            {logs.map((log, index) => (
              <LogEntry
                key={log.id}
                log={log}
                changedByName={userMap[log.changedBy] ?? '—'}
                isLast={index === logs.length - 1}
              />
            ))}
          </View>
        )}

        {/* Admin actions */}
        {user?.role === 'Admin' && (
          <View style={styles.actions}>
            <AppButton
              label="Editar Ordem"
              icon="edit"
              variant="secondary"
              onPress={() =>
                Alert.alert('Em breve', 'Função de edição em desenvolvimento.')
              }
              fullWidth
            />
            {canDelete && (
              <AppButton
                label="Cancelar Ordem"
                icon="cancel"
                variant="danger"
                onPress={handleCancel}
                loading={isCanceling}
                fullWidth
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={metaStyles.row}>
      <Text style={metaStyles.label}>{label}</Text>
      <Text style={metaStyles.value}>{value}</Text>
    </View>
  );
}

const metaStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    width: 110,
  },
  value: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
});

function LogEntry({
  log,
  changedByName,
  isLast,
}: {
  log: StatusLogEntry;
  changedByName: string;
  isLast: boolean;
}) {
  const dotColor =
    Colors.status[log.newStatus]?.text ?? Colors.textMuted;

  return (
    <View style={logStyles.entry}>
      <View style={logStyles.leftCol}>
        <View style={[logStyles.dot, { backgroundColor: dotColor }]} />
        {!isLast && <View style={logStyles.line} />}
      </View>
      <View style={logStyles.body}>
        <View style={logStyles.topRow}>
          <StatusBadge status={log.newStatus} size="sm" />
        </View>
        <Text style={logStyles.time}>{formatDateTime(log.changedAt)}</Text>
        <Text style={logStyles.user}>{changedByName}</Text>
        {log.description && (
          <Text style={logStyles.desc}>{log.description}</Text>
        )}
      </View>
    </View>
  );
}

const logStyles = StyleSheet.create({
  entry: {
    flexDirection: 'row',
    gap: 12,
  },
  leftCol: {
    alignItems: 'center',
    width: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  body: {
    flex: 1,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  user: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  desc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 14,
    lineHeight: 28,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  locationText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  locationEmpty: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Colors.radiusLg,
    paddingHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  descCard: {
    backgroundColor: Colors.white,
    borderRadius: Colors.radiusLg,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notesCard: {
    backgroundColor: Colors.primaryLight,
    borderColor: '#FED7AA',
  },
  descLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  noLogs: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  timeline: {
    gap: 0,
  },
  actions: {
    marginTop: 24,
    gap: 10,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
});
