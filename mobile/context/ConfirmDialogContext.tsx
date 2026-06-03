import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppButton from '@/components/AppButton';
import { Colors } from '@/constants/theme';

export interface ConfirmOptions {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

interface DialogState {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

export function ConfirmDialogProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<DialogState | null>(null);
  const resolveRef = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setState({ options, resolve });
    });
  }, []);

  const close = useCallback((result: boolean) => {
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
    setState(null);
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <Modal
        transparent
        animationType="fade"
        visible={!!state}
        onRequestClose={() => close(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => close(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.card}
          >
            {state?.options.icon && (
              <View
                style={[
                  styles.iconCircle,
                  state.options.destructive && styles.iconCircleDanger,
                ]}
              >
                <MaterialIcons
                  name={state.options.icon}
                  size={28}
                  color={state.options.destructive ? Colors.error : Colors.primary}
                />
              </View>
            )}

            <Text style={styles.title}>{state?.options.title}</Text>
            <Text style={styles.message}>{state?.options.message}</Text>

            <View style={styles.actions}>
              <View style={styles.actionFlex}>
                <AppButton
                  label={state?.options.cancelLabel ?? 'Cancelar'}
                  onPress={() => close(false)}
                  variant="secondary"
                  fullWidth
                />
              </View>
              <View style={styles.actionFlex}>
                <AppButton
                  label={state?.options.confirmLabel ?? 'Confirmar'}
                  onPress={() => close(true)}
                  variant={state?.options.destructive ? 'danger' : 'primary'}
                  fullWidth
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmDialogProvider');
  return ctx;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.white,
    borderRadius: Colors.radiusXl,
    padding: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircleDanger: {
    backgroundColor: Colors.errorLight,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    width: '100%',
  },
  actionFlex: {
    flex: 1,
  },
});
