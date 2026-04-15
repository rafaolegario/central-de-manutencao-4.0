import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/AppButton';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  MockTool,
  MockToolUsage,
  formatDate,
  formatDateTime,
  getInProgressOrdersForTechnician,
  getOpenUsagesForTool,
  getToolById,
  getUserById,
  returnTool,
} from '@/data/mock';

export default function ToolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [tool, setTool] = useState<MockTool | undefined>(getToolById(id));
  const [usages, setUsages] = useState<MockToolUsage[]>(
    getOpenUsagesForTool(id)
  );

  const refresh = useCallback(() => {
    const fresh = getToolById(id);
    setTool(fresh ? { ...fresh } : undefined);
    setUsages(getOpenUsagesForTool(id));
  }, [id]);

  if (!tool) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <MaterialIcons name="search-off" size={64} color={Colors.textMuted} />
          <Text style={styles.notFoundText}>Ferramenta não encontrada</Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  const isAdmin = user?.role === 'Admin';
  const isTechnician = user?.role === 'Technician';
  const hasInProgressOrder =
    !!user && getInProgressOrdersForTechnician(user.id).length > 0;
  const canWithdraw =
    isTechnician && tool.availableQuantity > 0 && hasInProgressOrder;

  const availabilityRatio = tool.availableQuantity / tool.totalQuantity;
  const availabilityColor =
    tool.availableQuantity === 0
      ? Colors.error
      : tool.availableQuantity < tool.totalQuantity
        ? Colors.warning
        : Colors.success;

  const handleWithdraw = () => {
    router.push({ pathname: '/(app)/tools/withdraw', params: { toolId: tool.id } });
  };

  const handleReturn = (usage: MockToolUsage) => {
    Alert.alert(
      'Devolver ferramenta',
      `Confirmar devolução de "${tool.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Devolver',
          onPress: () => {
            const result = returnTool(usage.id);
            if ('error' in result) {
              Alert.alert('Erro', result.error);
              return;
            }
            refresh();
            Alert.alert('Sucesso', 'Ferramenta devolvida com sucesso.');
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
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="build" size={28} color={Colors.primary} />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={styles.code}>{tool.code}</Text>
            <Text style={styles.name}>{tool.name}</Text>
          </View>
        </View>

        {/* Availability */}
        <View style={styles.availCard}>
          <View style={styles.availTopRow}>
            <Text style={styles.availLabel}>Disponibilidade</Text>
            <Text style={[styles.availValue, { color: availabilityColor }]}>
              {tool.availableQuantity} / {tool.totalQuantity}
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${availabilityRatio * 100}%`,
                  backgroundColor: availabilityColor,
                },
              ]}
            />
          </View>
        </View>

        {/* Metadata */}
        <View style={styles.card}>
          <MetaRow label="Código" value={tool.code} />
          <View style={styles.cardDivider} />
          <MetaRow label="Total" value={String(tool.totalQuantity)} />
          <View style={styles.cardDivider} />
          <MetaRow label="Disponíveis" value={String(tool.availableQuantity)} />
          <View style={styles.cardDivider} />
          <MetaRow label="Cadastrada em" value={formatDate(tool.createdAt)} />
        </View>

        {/* Active usages */}
        <Text style={styles.sectionTitle}>
          Usos ativos {usages.length > 0 && `(${usages.length})`}
        </Text>

        {usages.length === 0 ? (
          <Text style={styles.noData}>Nenhum uso ativo no momento.</Text>
        ) : (
          <View style={styles.usageList}>
            {usages.map((usage) => {
              const techUser = getUserById(usage.technicianId);
              const isMine = user?.id === usage.technicianId;
              return (
                <View key={usage.id} style={styles.usageRow}>
                  <View style={styles.usageBody}>
                    <View style={styles.usageHeader}>
                      <Text style={styles.usageTechnician}>
                        {techUser?.name ?? 'Técnico desconhecido'}
                      </Text>
                      {isMine && (
                        <View style={styles.mineTag}>
                          <Text style={styles.mineTagText}>Você</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.usageOrder}>OS: {usage.workOrderId}</Text>
                    <Text style={styles.usageTime}>
                      Retirada em {formatDateTime(usage.withdrawnAt)}
                    </Text>
                  </View>
                  {isMine && (
                    <TouchableOpacity
                      style={styles.returnBtn}
                      onPress={() => handleReturn(usage)}
                      activeOpacity={0.85}
                    >
                      <MaterialIcons name="input" size={16} color={Colors.white} />
                      <Text style={styles.returnBtnText}>Devolver</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {isTechnician && (
            <>
              <AppButton
                label={
                  canWithdraw
                    ? 'Retirar ferramenta'
                    : tool.availableQuantity === 0
                      ? 'Indisponível'
                      : 'Sem ordem em andamento'
                }
                icon="output"
                variant="primary"
                onPress={handleWithdraw}
                disabled={!canWithdraw}
                fullWidth
              />
              {!hasInProgressOrder && (
                <Text style={styles.hint}>
                  Você precisa ter uma ordem de serviço em andamento para retirar uma
                  ferramenta.
                </Text>
              )}
            </>
          )}
          {isAdmin && (
            <AppButton
              label="Editar Ferramenta"
              icon="edit"
              variant="secondary"
              onPress={() =>
                Alert.alert('Em breve', 'Função de edição em desenvolvimento.')
              }
              fullWidth
            />
          )}
        </View>
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
    width: 130,
  },
  value: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    fontWeight: '500',
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  code: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  availCard: {
    backgroundColor: Colors.surface,
    borderRadius: Colors.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginTop: 20,
  },
  availTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  availLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  availValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Colors.radiusLg,
    paddingHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  noData: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  usageList: {
    gap: 10,
  },
  usageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: Colors.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  usageBody: {
    flex: 1,
  },
  usageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  usageTechnician: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  mineTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  mineTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  usageOrder: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  usageTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  returnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  returnBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  actions: {
    marginTop: 24,
    gap: 10,
  },
  hint: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
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
