import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import AppSelect, { type AppSelectOption } from '@/components/AppSelect';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { PRIORITY_LABELS, SPECIALTY_LABELS } from '@/constants/labels';
import { useEditOrder, useOrder } from '@/services/orders/useOrders';
import { useUsers } from '@/services/users/useUsers';
import type { ServiceOrderPriority, UserSpecialty } from '@/types/api';

const PRIORITIES: ServiceOrderPriority[] = ['Low', 'Medium', 'High', 'Critical'];

function maskDate(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8);
  if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
}

function parseDueDate(input: string): string | undefined {
  const m = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return undefined;
  const [, dd, mm, yyyy] = m;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }
  return `${yyyy}-${mm}-${dd}`;
}

function isoToDdMmYyyy(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getUTCFullYear());
  return `${dd}/${mm}/${yyyy}`;
}

export default function EditOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const { data: order, isLoading, error } = useOrder(id);
  const { data: usersData } = useUsers({ role: 'Technician', active: true });
  const { mutate: editOrder, isLoading: isSubmitting, error: apiError } = useEditOrder();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<ServiceOrderPriority>('Medium');
  const [technicianId, setTechnicianId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill form fields once the order is fetched.
  useEffect(() => {
    if (!order) return;
    setTitle(order.title);
    setDescription(order.description);
    setLocation(order.location ?? '');
    setDueDate(isoToDdMmYyyy(order.dueDate));
    setPriority(order.priority);
    setTechnicianId(order.technicianId);
  }, [order]);

  const technicianOptions = useMemo<AppSelectOption[]>(
    () =>
      (usersData ?? []).map((u) => ({
        value: u.id,
        label: u.name,
        sublabel: u.specialty
          ? SPECIALTY_LABELS[u.specialty as UserSpecialty] ?? undefined
          : undefined,
      })),
    [usersData],
  );

  if (user?.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas administradores podem editar ordens de serviço.
          </Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

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
        <View style={styles.centered}>
          <Text style={styles.restrictedTitle}>Ordem não encontrada</Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  const editable =
    order.status === 'Open' || order.status === 'Assigned' || order.status === 'Reopened';

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Título é obrigatório.';
    if (!description.trim()) e.description = 'Descrição é obrigatória.';
    if (dueDate && !parseDueDate(dueDate)) e.dueDate = 'Data inválida. Use DD/MM/AAAA.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await editOrder({
        id: order.id,
        data: {
          title: title.trim(),
          description: description.trim(),
          location: location.trim() || undefined,
          priority,
          dueDate: dueDate ? parseDueDate(dueDate) : undefined,
          technicianId: technicianId,
        },
      });
      showSuccess('Ordem atualizada com sucesso.');
      router.back();
    } catch {
      showError(apiError?.errors?.[0] ?? 'Não foi possível atualizar a ordem.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!editable && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Esta ordem está com status {order.status} e tem edição limitada. Algumas
                alterações podem ser rejeitadas pelo servidor.
              </Text>
            </View>
          )}

          <AppInput
            label="Título *"
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Troca de rolamento"
            leftIcon="title"
            error={errors.title}
          />

          <View style={styles.gap} />

          <AppInput
            label="Descrição *"
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva o problema ou serviço necessário..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.multiline}
            error={errors.description}
          />

          <View style={styles.gap} />

          <AppInput
            label="Local"
            value={location}
            onChangeText={setLocation}
            placeholder="Ex: Galpão A — Linha 3"
            leftIcon="location-on"
          />

          <View style={styles.gap} />

          <AppInput
            label="Prazo"
            value={dueDate}
            onChangeText={(t) => setDueDate(maskDate(t))}
            placeholder="DD/MM/AAAA"
            leftIcon="event"
            keyboardType="number-pad"
            maxLength={10}
            error={errors.dueDate}
          />

          <View style={styles.gap} />

          <AppSelect
            label="Técnico responsável"
            value={technicianId}
            onChange={setTechnicianId}
            options={technicianOptions}
            placeholder="Não atribuído"
            leftIcon="engineering"
            nullable
            nullableLabel="Não atribuído"
            emptyText="Nenhum técnico ativo disponível."
          />

          <View style={styles.gap} />

          <Text style={styles.fieldLabel}>Prioridade *</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityChip,
                  priority === p && {
                    backgroundColor: Colors.priority[p].bg,
                    borderColor: Colors.priority[p].text,
                  },
                ]}
                onPress={() => setPriority(p)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.priorityChipText,
                    priority === p && { color: Colors.priority[p].text, fontWeight: '700' },
                  ]}
                >
                  {PRIORITY_LABELS[p]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {apiError && (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>
                {apiError.errors?.[0] ?? 'Erro ao salvar alterações.'}
              </Text>
            </View>
          )}

          <View style={styles.gapLg} />

          <AppButton
            label="Salvar Alterações"
            onPress={handleSubmit}
            loading={isSubmitting}
            fullWidth
            size="lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  kav: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  gap: {
    height: 16,
  },
  gapLg: {
    height: 24,
  },
  multiline: {
    minHeight: 100,
    paddingTop: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  priorityChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  banner: {
    backgroundColor: Colors.warningLight,
    borderRadius: Colors.radiusMd,
    padding: 12,
    marginBottom: 16,
  },
  bannerText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  apiErrorBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: Colors.radiusLg,
  },
  apiErrorText: {
    fontSize: 13,
    color: '#991B1B',
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
