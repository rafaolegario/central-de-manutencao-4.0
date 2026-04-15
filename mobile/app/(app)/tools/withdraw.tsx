import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
  getInProgressOrdersForTechnician,
  getToolById,
  withdrawTool,
} from '@/data/mock';

export default function WithdrawToolScreen() {
  const { toolId } = useLocalSearchParams<{ toolId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const tool = getToolById(toolId);
  const orders = user ? getInProgressOrdersForTechnician(user.id) : [];

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders[0]?.id ?? null
  );

  if (user?.role !== 'Technician') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas técnicos podem retirar ferramentas.
          </Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

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

  const handleConfirm = () => {
    if (!selectedOrderId) {
      Alert.alert('Selecione uma ordem', 'Escolha uma ordem de serviço em andamento.');
      return;
    }
    const result = withdrawTool({
      toolId: tool.id,
      technicianId: user.id,
      workOrderId: selectedOrderId,
    });
    if ('error' in result) {
      Alert.alert('Erro', result.error);
      return;
    }
    Alert.alert('Sucesso', 'Ferramenta retirada com sucesso.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Tool summary */}
        <View style={styles.toolCard}>
          <View style={styles.toolIcon}>
            <MaterialIcons name="build" size={24} color={Colors.primary} />
          </View>
          <View style={styles.toolTextCol}>
            <Text style={styles.toolCode}>{tool.code}</Text>
            <Text style={styles.toolName}>{tool.name}</Text>
            <Text style={styles.toolAvail}>
              Disponíveis: {tool.availableQuantity} de {tool.totalQuantity}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Selecione a ordem de serviço</Text>
        <Text style={styles.sectionSub}>
          A retirada é associada a uma das suas ordens em andamento.
        </Text>

        {orders.length === 0 ? (
          <View style={styles.emptyOrders}>
            <MaterialIcons name="info-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>
              Você não tem nenhuma ordem de serviço em andamento.
            </Text>
          </View>
        ) : (
          <View style={styles.orderList}>
            {orders.map((order) => {
              const selected = order.id === selectedOrderId;
              return (
                <TouchableOpacity
                  key={order.id}
                  style={[styles.orderCard, selected && styles.orderCardSelected]}
                  onPress={() => setSelectedOrderId(order.id)}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.radio,
                      selected && styles.radioSelected,
                    ]}
                  >
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.orderBody}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderTitle} numberOfLines={2}>
                      {order.title}
                    </Text>
                    {order.location && (
                      <View style={styles.orderLocation}>
                        <MaterialIcons
                          name="location-on"
                          size={12}
                          color={Colors.textMuted}
                        />
                        <Text style={styles.orderLocationText}>{order.location}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.gapLg} />

        <AppButton
          label="Confirmar Retirada"
          icon="output"
          onPress={handleConfirm}
          fullWidth
          size="lg"
          disabled={orders.length === 0 || tool.availableQuantity === 0}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: Colors.radiusLg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolTextCol: {
    flex: 1,
  },
  toolCode: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  toolName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  toolAvail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 24,
  },
  sectionSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 14,
  },
  orderList: {
    gap: 10,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Colors.radiusMd,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  orderCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  orderBody: {
    flex: 1,
  },
  orderId: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  orderLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  orderLocationText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  emptyOrders: {
    alignItems: 'center',
    gap: 10,
    padding: 24,
    borderRadius: Colors.radiusLg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  gapLg: {
    height: 24,
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
  restricted: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  restrictedIcon: {
    fontSize: 48,
  },
  restrictedTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  restrictedSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
