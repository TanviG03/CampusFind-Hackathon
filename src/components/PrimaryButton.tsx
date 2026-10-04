import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme';

export function PrimaryButton({
  title,
  onPress,
  style,
  loading = false,
}: {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  loading?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.label}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    boxShadow: '0px 5px 10px rgba(51, 68, 168, 0.16)',
  },
  label: { color: colors.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.1 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
