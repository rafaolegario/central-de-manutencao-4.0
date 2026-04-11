import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '@/constants/theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
}

export default function AppInput({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...rest
}: AppInputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? Colors.error
    : focused
    ? Colors.primary
    : Colors.border;

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, { borderColor }]}>
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={18}
            color={Colors.textMuted}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} activeOpacity={0.7}>
            <MaterialIcons
              name={rightIcon}
              size={18}
              color={Colors.textMuted}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Colors.radiusMd,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  error: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
});
