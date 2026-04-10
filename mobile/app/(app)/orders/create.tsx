import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { PRIORITY_LABELS, ServiceOrderPriority } from '@/data/mock';

const PRIORITIES: ServiceOrderPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export default function CreateOrderScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<ServiceOrderPriority>('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (user?.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedSub}>
            Apenas administradores podem criar ordens de serviço.
          </Text>
          <AppButton label="Voltar" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Título é obrigatório.';
    if (!description.trim()) e.description = 'Descrição é obrigatória.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    // TODO: POST to API and update local state
    await new Promise((r) => setTimeout(r, 700));
    setIsSubmitting(false);
    Alert.alert('Sucesso', 'Ordem de serviço criada com sucesso!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
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
            onChangeText={setDueDate}
            placeholder="DD/MM/AAAA"
            leftIcon="event"
            keyboardType="numeric"
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

          <View style={styles.gapLg} />

          <AppButton
            label="Criar Ordem"
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
