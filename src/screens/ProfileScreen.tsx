import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppScreen } from '../components/AppScreen';
import { useCampusFind } from '../context/CampusFindContext';
import { colors } from '../theme';
import { MainTabParamList, RootStackParamList } from '../types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type TabNavigation = BottomTabNavigationProp<MainTabParamList>;

export function ProfileScreen() {
  const tabs = useNavigation<TabNavigation>();
  const navigation = tabs.getParent<Navigation>();
  const { userName } = useCampusFind();
  const initials = userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <AppScreen>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Your CampusFind account.</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>Campus member · Demo account</Text>
      </View>

      <Text style={styles.groupLabel}>ACCOUNT</Text>
      <View style={styles.menuCard}>
        <MenuRow icon="clipboard-text-outline" label="My reports" onPress={() => tabs.navigate('MyReports')} />
        <MenuRow icon="magnify" label="Browse items" onPress={() => tabs.navigate('Browse')} last />
      </View>

      <Text style={styles.groupLabel}>ABOUT</Text>
      <View style={styles.infoCard}>
        <MaterialCommunityIcons name="hand-heart-outline" size={20} color={colors.primary} />
        <Text style={styles.aboutText}>CampusFind helps students reconnect with belongings through their campus community.</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          Alert.alert('Signed out', 'You are signed out of this demo session.');
          navigation?.replace('Login');
        }}
        style={styles.signOut}
      >
        <MaterialCommunityIcons name="logout" size={18} color={colors.red} />
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </AppScreen>
  );
}

function MenuRow({ icon, label, onPress, last = false }: { icon: string; label: string; onPress: () => void; last?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.menuRow, !last && styles.menuBorder]}>
      <MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons.glyphMap} size={20} color={colors.primary} />
      <Text style={styles.menuLabel}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.ink, fontSize: 27, fontWeight: '800', letterSpacing: -0.65 },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 6, marginBottom: 22 },
  profileCard: { alignItems: 'center', paddingVertical: 27, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 20, boxShadow: '0px 3px 9px rgba(23, 36, 58, 0.035)' },
  avatar: { width: 72, height: 72, borderRadius: 24, backgroundColor: colors.primarySoft, justifyContent: 'center', alignItems: 'center' },
  initials: { color: colors.primary, fontWeight: '800', fontSize: 22 },
  name: { color: colors.ink, fontSize: 19, fontWeight: '800', marginTop: 14, letterSpacing: -0.2 },
  email: { color: colors.muted, fontSize: 12, marginTop: 6 },
  groupLabel: { color: colors.muted, fontWeight: '800', letterSpacing: 1.15, fontSize: 10, marginTop: 27, marginBottom: 11 },
  menuCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 18, paddingHorizontal: 15, boxShadow: '0px 3px 8px rgba(23, 36, 58, 0.03)' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 13, minHeight: 59 },
  menuBorder: { borderBottomColor: colors.line, borderBottomWidth: 1 },
  menuLabel: { color: colors.ink, fontSize: 14, fontWeight: '700', flex: 1 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.primarySoft, borderRadius: 16, padding: 16 },
  aboutText: { color: colors.primaryDark, fontSize: 12, lineHeight: 20, flex: 1 },
  signOut: { marginTop: 25, minHeight: 52, borderRadius: 15, borderWidth: 1, borderColor: '#F5DADB', backgroundColor: colors.redSoft, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center' },
  signOutText: { color: colors.red, fontSize: 13, fontWeight: '700' },
});
