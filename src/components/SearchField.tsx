import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search items or locations',
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="magnify" size={21} color={colors.muted} />
      <TextInput
        accessibilityLabel="Search lost and found items"
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        returnKeyType="search"
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: colors.surface,
    borderColor: '#E8EBF3',
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 16,
    boxShadow: '0px 3px 8px rgba(23, 36, 58, 0.04)',
  },
  input: { flex: 1, color: colors.ink, fontSize: 14, letterSpacing: 0.1 },
});
