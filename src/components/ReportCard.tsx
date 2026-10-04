import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CampusItem } from '../types';
import { colors, spacing } from '../theme';

export function ReportCard({
  item,
  onPress,
  compact = false,
}: {
  item: CampusItem;
  onPress: () => void;
  compact?: boolean;
}) {
  const found = item.status === 'Found';
  const accent = found ? colors.green : colors.orange;
  const softAccent = found ? colors.greenSoft : colors.orangeSoft;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.status} item: ${item.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed]}
    >
      <View style={[styles.iconBox, { backgroundColor: softAccent }]}>
        <MaterialCommunityIcons
          name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={25}
          color={accent}
        />
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
          <View style={[styles.badge, { backgroundColor: softAccent }]}>
            <View style={[styles.statusDot, { backgroundColor: accent }]} />
            <Text style={[styles.badgeText, { color: accent }]}>
              {item.status}
            </Text>
          </View>
        </View>
        <Text style={styles.category}>{item.category}</Text>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color={colors.muted} />
          <Text numberOfLines={1} style={styles.meta}>{item.location}</Text>
          {!compact && <Text style={styles.dot}>·</Text>}
          {!compact && <Text style={styles.meta}>{item.date.split(',')[0]}</Text>}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: colors.line,
    boxShadow: '0px 3px 9px rgba(23, 36, 58, 0.035)',
  },
  compact: { width: 270, marginRight: 11, marginBottom: 0, alignItems: 'flex-start' },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  iconBox: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, minWidth: 0 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  title: { flex: 1, color: colors.ink, fontSize: 14, fontWeight: '700', letterSpacing: 0.05 },
  badge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 9, flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.15 },
  category: { color: colors.muted, fontSize: 12, marginTop: 4, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { flexShrink: 1, color: colors.muted, fontSize: 11, letterSpacing: 0.05 },
  dot: { color: colors.muted, fontSize: 13 },
});
