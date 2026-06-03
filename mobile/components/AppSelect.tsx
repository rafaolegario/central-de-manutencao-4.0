import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '@/constants/theme';

export interface AppSelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
  sublabel?: string;
}

interface AppSelectProps<TValue extends string = string> {
  label?: string;
  value: TValue | null;
  onChange: (value: TValue | null) => void;
  options: AppSelectOption<TValue>[];
  placeholder?: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  nullable?: boolean;
  nullableLabel?: string;
  emptyText?: string;
  disabled?: boolean;
  error?: string;
}

export default function AppSelect<TValue extends string = string>({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecionar...',
  leftIcon,
  nullable = false,
  nullableLabel = 'Nenhum',
  emptyText = 'Nenhuma opção disponível.',
  disabled = false,
  error,
}: AppSelectProps<TValue>) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected?.label ?? (value === null ? nullableLabel : placeholder);
  const isPlaceholder = !selected && value !== null;

  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.trigger,
          { borderColor: error ? Colors.error : Colors.border },
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setOpen(true)}
        activeOpacity={0.85}
      >
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={18}
            color={Colors.textMuted}
            style={styles.leftIcon}
          />
        )}
        <Text
          style={[styles.triggerText, isPlaceholder && styles.placeholder]}
          numberOfLines={1}
        >
          {displayLabel}
        </Text>
        <MaterialIcons name="expand-more" size={20} color={Colors.textMuted} />
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        transparent
        animationType="fade"
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.sheet}>
            <View style={styles.handle} />
            {label && <Text style={styles.sheetTitle}>{label}</Text>}

            {options.length === 0 && !nullable ? (
              <Text style={styles.empty}>{emptyText}</Text>
            ) : (
              <FlatList
                data={
                  nullable
                    ? [{ value: null as null, label: nullableLabel } as never, ...options]
                    : options
                }
                keyExtractor={(item, index) =>
                  item?.value === null ? '__null__' : String(item.value ?? index)
                }
                ItemSeparatorComponent={() => <View style={styles.divider} />}
                renderItem={({ item }) => {
                  const itemValue = (item as AppSelectOption<TValue>).value;
                  const itemLabel = (item as AppSelectOption<TValue>).label;
                  const itemSub = (item as AppSelectOption<TValue>).sublabel;
                  const isSelected = itemValue === value;
                  return (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => {
                        onChange(itemValue);
                        setOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionBody}>
                        <Text
                          style={[
                            styles.optionLabel,
                            isSelected && styles.optionLabelSelected,
                          ]}
                        >
                          {itemLabel}
                        </Text>
                        {itemSub && <Text style={styles.optionSub}>{itemSub}</Text>}
                      </View>
                      {isSelected && (
                        <MaterialIcons name="check" size={20} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Colors.radiusMd,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  disabled: {
    backgroundColor: Colors.surface,
  },
  leftIcon: {
    marginRight: 8,
  },
  triggerText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  placeholder: {
    color: Colors.textMuted,
  },
  error: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Colors.radiusXl,
    borderTopRightRadius: Colors.radiusXl,
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 16,
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  empty: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 32,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  optionBody: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  optionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
