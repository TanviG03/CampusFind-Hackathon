import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { ReportCard } from '../components/ReportCard';
import { SearchField } from '../components/SearchField';
import { SectionHeading } from '../components/SectionHeading';
import { useCampusFind } from '../context/CampusFindContext';
import { colors } from '../theme';
import { MainTabParamList, ReportStatus, RootStackParamList } from '../types';

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
type TabNavigation = BottomTabNavigationProp<MainTabParamList>;

function useRootNavigation() {
  return useNavigation<RootNavigation>();
}

export function HomeScreen() {
  const navigation = useRootNavigation();
  const tabs = useNavigation<TabNavigation>();
  const { items, userName } = useCampusFind();
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const recentLost = items.filter((item) => item.status === 'Lost' && !item.resolved);
  const recentFound = items.filter((item) => item.status === 'Found' && !item.resolved);
  const searchMatches = (title: string) => !normalizedQuery || title.toLowerCase().includes(normalizedQuery);

  return (
    <AppScreen>
      <View style={styles.topline}>
        <View>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <MaterialCommunityIcons name="magnify" size={15} color={colors.primaryDark} />
            </View>
            <Text style={styles.eyebrow}>CAMPUSFIND</Text>
          </View>
          <Text style={styles.welcome}>Hi, {userName.split(' ')[0]}!</Text>
          <Text style={styles.welcomeSub}>Let’s get your things back.</Text>
        </View>
        <Pressable onPress={() => tabs.navigate('Profile')} style={styles.avatar}>
          <Text style={styles.avatarText}>{userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</Text>
          <View style={styles.avatarStatus} />
        </Pressable>
      </View>

      <SearchField value={query} onChangeText={setQuery} />
      {normalizedQuery ? (
        <View style={styles.searchResults}>
          <SectionHeading title="Search results" action={
            <Text style={styles.viewAll} onPress={() => tabs.navigate('Browse')}>Browse all</Text>
          } />
          {items.filter((item) => !item.resolved && searchMatches(`${item.title} ${item.location} ${item.category}`)).slice(0, 3).map((item) => (
            <ReportCard key={item.id} item={item} onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })} />
          ))}
          {items.every((item) => item.resolved || !searchMatches(`${item.title} ${item.location} ${item.category}`)) && (
            <Text style={styles.emptySearch}>No matching items yet. Try another search.</Text>
          )}
        </View>
      ) : (
        <>
          <SectionHeading title="What do you need?" />
          <View style={styles.actions}>
            <Pressable
              onPress={() => navigation.navigate('ReportLost')}
              style={({ pressed }) => [styles.actionCard, styles.lostAction, pressed && styles.actionPressed]}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#DFE4FF' }]}>
                <MaterialCommunityIcons name="magnify" size={23} color={colors.primary} />
              </View>
              <View style={styles.actionFooter}>
                <Text style={styles.actionTitle}>I lost something</Text>
                <Text style={styles.actionHint}>Create a lost report</Text>
              </View>
              <View style={styles.actionArrow}>
                <MaterialCommunityIcons name="arrow-top-right" size={17} color={colors.orange} />
              </View>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('ReportFound')}
              style={({ pressed }) => [styles.actionCard, styles.foundAction, pressed && styles.actionPressed]}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#DDF3E9' }]}>
                <MaterialCommunityIcons name="hand-heart-outline" size={23} color={colors.green} />
              </View>
              <View style={styles.actionFooter}>
                <Text style={styles.actionTitle}>I found something</Text>
                <Text style={styles.actionHint}>Help return an item</Text>
              </View>
              <View style={styles.actionArrow}>
                <MaterialCommunityIcons name="arrow-top-right" size={17} color={colors.green} />
              </View>
            </Pressable>
          </View>

          <SectionHeading title="Recently lost" action={<Text style={styles.viewAll} onPress={() => tabs.navigate('Browse')}>View all</Text>} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {recentLost.slice(0, 4).map((item) => (
              <ReportCard key={item.id} compact item={item} onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })} />
            ))}
            {!recentLost.length && <Text style={styles.emptyInline}>No recent lost reports.</Text>}
          </ScrollView>

          <SectionHeading title="Recently found" action={<Text style={styles.viewAll} onPress={() => tabs.navigate('Browse')}>View all</Text>} />
          {recentFound.slice(0, 2).map((item) => (
            <ReportCard key={item.id} item={item} onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })} />
          ))}
          {!recentFound.length && <Text style={styles.emptyInline}>No recent found reports.</Text>}
        </>
      )}
      <View style={styles.campusNote}>
        <MaterialCommunityIcons name="account-group-outline" size={18} color={colors.primary} />
        <Text style={styles.campusNoteText}>Your campus community is here to help.</Text>
      </View>
    </AppScreen>
  );
}

export function BrowseScreen() {
  const navigation = useRootNavigation();
  const { items } = useCampusFind();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | ReportStatus>('All');
  const [category, setCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(items.map((item) => item.category))).sort()];
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = filter === 'All' || item.status === filter;
      const matchesCategory = category === 'All' || item.category === category;
      return matchesStatus && matchesCategory && !item.resolved && item.title.toLowerCase().includes(term);
    });
  }, [category, filter, items, query]);

  return (
    <AppScreen>
      <Text style={styles.pageTitle}>Browse items</Text>
      <Text style={styles.pageSubtitle}>See what’s been lost or found around campus.</Text>
      <SearchField value={query} onChangeText={setQuery} />
      <View style={styles.filterRow}>
        {(['All', 'Lost', 'Found'] as const).map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === option }}
            accessibilityLabel={`${option} status filter`}
            onPress={() => setFilter(option)}
            style={[
              styles.filterPill,
              filter === option && styles.filterPillActive,
              filter === option && option === 'Lost' && styles.lostFilterActive,
              filter === option && option === 'Found' && styles.foundFilterActive,
            ]}
          >
            <Text style={[styles.filterText, filter === option && styles.filterTextActive]}>{option}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categories.map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: category === option }}
            accessibilityLabel={`${option} category filter`}
            onPress={() => setCategory(option)}
            style={({ pressed }) => [
              styles.categoryPill,
              category === option && styles.categoryPillActive,
              pressed && styles.choicePressed,
            ]}
          >
            <Text style={[styles.categoryText, category === option && styles.categoryTextActive]}>{option}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Text style={styles.resultCount}>{filtered.length} {filtered.length === 1 ? 'report' : 'reports'}</Text>
      {filtered.map((item) => (
        <ReportCard key={item.id} item={item} onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })} />
      ))}
      {!filtered.length && (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="archive-search-outline" size={28} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptyText}>Try changing your search or filter.</Text>
        </View>
      )}
    </AppScreen>
  );
}

export function MyReportsScreen() {
  const navigation = useRootNavigation();
  const tabs = useNavigation<TabNavigation>();
  const { items, markResolved } = useCampusFind();
  const mine = items.filter((item) => item.createdByMe);

  return (
    <AppScreen>
      <Text style={styles.pageTitle}>My reports</Text>
      <Text style={styles.pageSubtitle}>Keep track of the items you’ve reported.</Text>
      {mine.length ? mine.map((item) => (
        <View key={item.id}>
          <ReportCard item={item} onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })} />
          {item.resolved ? (
            <View style={styles.resolutionLabel}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={colors.green} />
              <Text style={styles.resolutionText}>{item.resolutionStatus ?? 'Resolved'}</Text>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => markResolved(item.id, item.status === 'Lost' ? 'Recovered' : 'Returned')}
              style={styles.resolveButton}
            >
              <MaterialCommunityIcons name="check-circle-outline" size={17} color={colors.green} />
              <Text style={styles.resolveButtonText}>
                Mark as {item.status === 'Lost' ? 'Recovered' : 'Returned'}
              </Text>
            </Pressable>
          )}
        </View>
      )) : (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={29} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your reports will show up here</Text>
          <Text style={styles.emptyText}>Post a lost or found item and keep track of it here.</Text>
          <PrimaryButton title="Browse reports" onPress={() => tabs.navigate('Browse')} style={styles.emptyButton} />
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  topline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -20,
    marginHorizontal: -20,
    marginBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 21,
    paddingBottom: 24,
    backgroundColor: colors.primaryDark,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  brandIcon: { width: 23, height: 23, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  eyebrow: { color: '#D9DEFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  welcome: { color: colors.white, fontSize: 27, fontWeight: '800', letterSpacing: -0.6 },
  welcomeSub: { color: '#D9DEFF', fontSize: 13, marginTop: 5 },
  avatar: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  avatarText: { color: colors.primaryDark, fontWeight: '800', fontSize: 13 },
  avatarStatus: { position: 'absolute', right: -1, bottom: -1, width: 11, height: 11, borderRadius: 6, backgroundColor: '#41C799', borderWidth: 2, borderColor: colors.primaryDark },
  actions: { flexDirection: 'row', gap: 11, marginTop: 1, marginBottom: 27 },
  actionCard: {
    flex: 1,
    minHeight: 157,
    borderRadius: 19,
    padding: 14,
    justifyContent: 'space-between',
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  lostAction: { backgroundColor: '#FFF8F0', borderColor: '#F4E5D5' },
  foundAction: { backgroundColor: '#EFF8F3', borderColor: '#DCEEE4' },
  actionIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionFooter: { paddingRight: 16 },
  actionPressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  actionTitle: { color: colors.ink, fontSize: 14, fontWeight: '800', lineHeight: 19 },
  actionHint: { color: colors.muted, fontSize: 10, marginTop: 4, lineHeight: 14 },
  actionArrow: { position: 'absolute', right: 12, bottom: 12, width: 26, height: 26, borderRadius: 9, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  horizontalList: { marginBottom: 25 },
  viewAll: { color: colors.primary, fontWeight: '700', fontSize: 12, paddingVertical: 4 },
  emptyInline: { color: colors.muted, fontSize: 13, paddingVertical: 12 },
  campusNote: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 8, marginBottom: 3, padding: 15, backgroundColor: colors.primarySoft, borderRadius: 15 },
  campusNoteText: { color: colors.primaryDark, fontSize: 12, fontWeight: '700' },
  searchResults: { marginTop: 22 },
  emptySearch: { color: colors.muted, textAlign: 'center', paddingVertical: 26, fontSize: 13, lineHeight: 20 },
  pageTitle: { color: colors.ink, fontSize: 27, fontWeight: '800', letterSpacing: -0.65 },
  pageSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 6, marginBottom: 21 },
  filterRow: { flexDirection: 'row', gap: 9, marginTop: 16, marginBottom: 8 },
  filterPill: { paddingHorizontal: 17, paddingVertical: 10, borderRadius: 13, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1 },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  lostFilterActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  foundFilterActive: { backgroundColor: colors.green, borderColor: colors.green },
  filterText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  filterTextActive: { color: '#FFFFFF' },
  resultCount: { color: colors.muted, fontSize: 12, marginBottom: 13, marginTop: 8, fontWeight: '600' },
  categoryRow: { gap: 8, paddingVertical: 3, marginBottom: 8 },
  categoryPill: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  categoryPillActive: { backgroundColor: colors.primarySoft, borderColor: '#D9DEFF' },
  categoryText: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  categoryTextActive: { color: colors.primaryDark },
  choicePressed: { opacity: 0.78 },
  resolveButton: { minHeight: 44, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, marginTop: -3, marginBottom: 15, borderRadius: 13, borderWidth: 1, borderColor: '#D9EEE5', backgroundColor: colors.greenSoft },
  resolveButtonText: { color: colors.green, fontSize: 12, fontWeight: '800' },
  resolutionLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 5, marginTop: -3, marginBottom: 15 },
  resolutionText: { color: colors.green, fontSize: 12, fontWeight: '700' },
  emptyBox: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: 20, padding: 25, marginTop: 25 },
  emptyIcon: { width: 58, height: 58, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft, marginBottom: 4 },
  emptyTitle: { color: colors.ink, fontSize: 16, fontWeight: '800', textAlign: 'center', marginTop: 12 },
  emptyText: { color: colors.muted, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 7, maxWidth: 250 },
  emptyButton: { marginTop: 18, minWidth: 170 },
});
