import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { ROLE_LABELS, SPECIALTY_LABELS } from '@/constants/labels';
import { getInitials } from '@/utils/format';
import type { User, UserRole, UserSpecialty } from '@/types/api';

interface UserCardProps {
  user: User;
  onPress: () => void;
  disabled?: boolean;
}

export default function UserCard({ user, onPress, disabled = false }: UserCardProps) {
  const initials = getInitials(user.name);

  return (
    <TouchableOpacity
      style={[styles.card, disabled && styles.cardDisabled]}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.9}
      disabled={disabled}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {user.name}
          </Text>
          <View
            style={[
              styles.activeDot,
              { backgroundColor: user.active ? Colors.success : Colors.textMuted },
            ]}
          />
        </View>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>

        <View style={styles.badgeRow}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{ROLE_LABELS[user.role as UserRole]}</Text>
          </View>
          {user.specialty && user.specialty !== 'General' && (
            <View style={styles.specialtyBadge}>
              <Text style={styles.specialtyBadgeText}>
                {SPECIALTY_LABELS[user.specialty as UserSpecialty]}
              </Text>
            </View>
          )}
          {!user.active && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveBadgeText}>Inativo</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Colors.radiusLg,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  email: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  roleBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  specialtyBadge: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  specialtyBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  inactiveBadge: {
    backgroundColor: Colors.errorLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  inactiveBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.error,
  },
});
