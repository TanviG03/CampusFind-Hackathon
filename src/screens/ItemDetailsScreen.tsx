import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { useCampusFind } from '../context/CampusFindContext';
import { colors } from '../theme';
import { RootStackParamList } from '../types';

type DetailRoute = RouteProp<RootStackParamList, 'ItemDetails'>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function ItemDetailsScreen() {
  const [contactMessage, setContactMessage] = useState('');
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<Navigation>();
  const { items, markResolved } = useCampusFind();
  const item = items.find((candidate) => candidate.id === route.params.itemId);

  if (!item) {
    return (
      <AppScreen>
        <Text style={styles.back} onPress={() => navigation.goBack()}>‹  Back</Text>
        <Text style={styles.title}>Report not found</Text>
        <Text style={styles.subtitle}>This report may have been removed.</Text>
      </AppScreen>
    );
  }

  const found = item.status === 'Found';
  const statusAccent = found ? colors.green : colors.orange;
  const resolutionStatus = item.status === 'Lost' ? 'Recovered' : 'Returned';
  return (
    <AppScreen>
      <Text style={styles.back} onPress={() => navigation.goBack()}>‹  Back to reports</Text>
      <View style={[styles.itemVisual, { backgroundColor: found ? colors.greenSoft : colors.primarySoft }]}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.itemImage} resizeMode="cover" />
        ) : (
          <MaterialCommunityIcons
            name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={58}
            color={statusAccent}
          />
        )}
      </View>
      {route.params.justCreated && (
        <View style={styles.successBanner}>
          <MaterialCommunityIcons name="check-circle-outline" size={19} color={colors.green} />
          <Text style={styles.successText}>Your {item.status.toLowerCase()} report was added.</Text>
        </View>
      )}
      <View style={[styles.statusPill, { backgroundColor: found ? colors.greenSoft : colors.orangeSoft }]}>
        <Text style={[styles.statusText, { color: found ? colors.green : colors.orange }]}>{item.status} item</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{item.category}</Text>
      {item.resolved && (
        <View style={styles.resolvedBanner}>
          <MaterialCommunityIcons name="check-circle-outline" size={19} color={colors.green} />
          <Text style={styles.resolvedText}>Marked as {item.resolutionStatus ?? resolutionStatus}.</Text>
        </View>
      )}

      <View style={styles.detailsCard}>
        <DetailRow icon="map-marker-outline" label={found ? 'Found location' : 'Last seen location'} value={item.location} />
        <DetailRow icon="clock-outline" label={found ? 'Date found' : 'Date lost'} value={item.date} />
        <DetailRow icon="account-outline" label="Posted by" value={item.owner} last />
      </View>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{item.description}</Text>

      {!item.resolved && (
        <View style={styles.actions}>
          <PrimaryButton
            title={found ? 'Claim item' : 'Contact poster'}
            onPress={() => setContactMessage(
              `${item.owner} posted this report. Direct messaging will be available when campus accounts are connected.`,
            )}
          />
          {!!contactMessage && <Text accessibilityRole="alert" style={styles.contactMessage}>{contactMessage}</Text>}
          {item.createdByMe && (
            <Pressable
              accessibilityRole="button"
              onPress={() => markResolved(item.id, resolutionStatus)}
              style={styles.resolveButton}
            >
              <Text style={styles.resolveLabel}>Mark as {resolutionStatus}</Text>
            </Pressable>
          )}
        </View>
      )}
    </AppScreen>
  );
}

function DetailRow({ icon, label, value, last = false }: { icon: string; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detailRow, !last && styles.detailBorder]}>
      <View style={styles.detailIcon}>
        <MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons.glyphMap} size={19} color={colors.primary} />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.primary, fontWeight: '700', fontSize: 14, marginBottom: 18, paddingVertical: 5 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 22, marginTop: 8 },
  itemVisual: { height: 205, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 19, overflow: 'hidden' },
  itemImage: { width: '100%', height: '100%', borderRadius: 23 },
  successBanner: { marginBottom: 15, backgroundColor: colors.greenSoft, borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 9 },
  successText: { color: colors.green, fontSize: 13, fontWeight: '700' },
  statusPill: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 11, paddingVertical: 7, marginBottom: 12 },
  statusText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.2 },
  title: { color: colors.ink, fontSize: 27, fontWeight: '800', letterSpacing: -0.65 },
  category: { color: colors.muted, fontSize: 13, marginTop: 6 },
  detailsCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 19, paddingHorizontal: 15, marginTop: 23, boxShadow: '0px 3px 9px rgba(23, 36, 58, 0.035)' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 13, minHeight: 70 },
  detailBorder: { borderBottomColor: colors.line, borderBottomWidth: 1 },
  detailIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  detailContent: { flex: 1, gap: 3 },
  detailLabel: { color: colors.muted, fontSize: 11, fontWeight: '500' },
  detailValue: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '800', marginTop: 25, marginBottom: 9 },
  description: { color: colors.muted, fontSize: 14, lineHeight: 23 },
  actions: { gap: 11, marginTop: 25, marginBottom: 15 },
  contactMessage: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  resolveButton: { minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 15, borderColor: '#D9EEE5', borderWidth: 1, backgroundColor: colors.greenSoft },
  resolveLabel: { color: colors.green, fontSize: 14, fontWeight: '700' },
  resolvedBanner: { marginTop: 15, backgroundColor: colors.greenSoft, borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 9 },
  resolvedText: { color: colors.green, fontSize: 13, fontWeight: '700' },
});
