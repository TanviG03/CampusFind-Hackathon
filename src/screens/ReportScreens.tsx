import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { useCampusFind } from '../context/CampusFindContext';
import { colors } from '../theme';
import { ReportStatus, RootStackParamList } from '../types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

function ReportForm({ status }: { status: ReportStatus }) {
  const navigation = useNavigation<Navigation>();
  const { addReport } = useCampusFind();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayAsDateInput());
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [formError, setFormError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const found = status === 'Found';
  const accent = found ? colors.green : colors.orange;

  const submit = () => {
    if (!title.trim() || !category.trim() || !location.trim() || !description.trim() || !isValidDate(date)) {
      setFormError('Complete every field and enter a valid date in YYYY-MM-DD format.');
      return;
    }
    setFormError('');
    const item = addReport({
      status,
      title: title.trim(),
      category: category.trim(),
      location: location.trim(),
      description: description.trim(),
      date: date.trim(),
      imageUri,
      icon: found ? 'hand-heart-outline' : 'magnify',
      accent,
      resolved: false,
    });
    navigation.replace('ItemDetails', { itemId: item.id, justCreated: true });
  };

  const choosePhoto = async () => {
    setPhotoError('');
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setPhotoError('Allow photo library access to attach a photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.75,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch {
      setPhotoError('Could not open your photo library. Check permissions and try again.');
    }
  };

  return (
    <AppScreen>
      <Text onPress={() => navigation.goBack()} style={styles.back}>‹  Back</Text>
      <View style={[styles.reportType, { backgroundColor: found ? colors.greenSoft : colors.orangeSoft }]}>
        <View style={[styles.heroIcon, { backgroundColor: found ? '#DDF0E6' : '#FBE5CE' }]}>
          <MaterialCommunityIcons name={found ? 'hand-heart-outline' : 'magnify'} size={27} color={accent} />
        </View>
        <View style={styles.reportTypeCopy}>
          <Text style={[styles.reportTypeLabel, { color: found ? colors.green : colors.orange }]}>
            {found ? 'FOUND ITEM' : 'LOST ITEM'}
          </Text>
          <Text style={styles.reportTypeHint}>{found ? 'Help return it to its owner' : 'Tell your campus what went missing'}</Text>
        </View>
      </View>
      <Text style={styles.title}>{found ? 'Report a found item' : 'Report a lost item'}</Text>
      <Text style={styles.subtitle}>
        {found ? 'Help its owner find their way back to it.' : 'Share a few details so your campus can help.'}
      </Text>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.form}>
          <Field label="Item name" placeholder="e.g. Blue student ID card" value={title} onChangeText={setTitle} />
          <Field label="Category" placeholder="e.g. Cards & ID, Electronics, Keys" value={category} onChangeText={setCategory} />
          <Field label={found ? 'Found location' : 'Last seen location'} placeholder="e.g. Central Library, first floor" value={location} onChangeText={setLocation} />
          <Field label={found ? 'Date found' : 'Date lost'} placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />
          <Field label="Description" placeholder="Add details that help identify the item" value={description} onChangeText={setDescription} multiline />
          <View style={styles.field}>
            <Text style={styles.label}>Photo (optional)</Text>
            <Pressable accessibilityRole="button" onPress={choosePhoto} style={styles.photoButton}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.photoPreview} />
              ) : (
                <MaterialCommunityIcons name="camera-plus-outline" size={22} color={accent} />
              )}
              <Text style={styles.photoLabel}>{imageUri ? 'Change photo' : 'Add a photo'}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
      {!!formError && <Text accessibilityRole="alert" style={styles.formError}>{formError}</Text>}
      {!!photoError && <Text accessibilityRole="alert" style={styles.formError}>{photoError}</Text>}
      <Text style={styles.privacyNote}>
        <MaterialCommunityIcons name="shield-check-outline" size={15} color={colors.muted} />  Keep personal details private in your description.
      </Text>
      <PrimaryButton title={found ? 'Post found item' : 'Post lost item'} onPress={submit} style={styles.submit} />
    </AppScreen>
  );
}

function todayAsDateInput() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return false;
  const [year, month, day] = value.trim().split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

export function ReportLostScreen() {
  return <ReportForm status="Lost" />;
}

export function ReportFoundScreen() {
  return <ReportForm status="Found" />;
}

const styles = StyleSheet.create({
  back: { color: colors.primary, fontWeight: '700', fontSize: 14, marginBottom: 18, paddingVertical: 4 },
  reportType: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 17, padding: 12, marginBottom: 22 },
  heroIcon: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  reportTypeCopy: { flex: 1, gap: 3 },
  reportTypeLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  reportTypeHint: { color: colors.ink, fontSize: 12, fontWeight: '600' },
  title: { color: colors.ink, fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 7, marginBottom: 22 },
  form: { gap: 18 },
  field: { gap: 9 },
  label: { color: colors.ink, fontSize: 13, fontWeight: '700', letterSpacing: 0.05 },
  input: { minHeight: 53, paddingHorizontal: 15, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, color: colors.ink, fontSize: 14 },
  textArea: { height: 112, paddingTop: 14 },
  photoButton: { minHeight: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 15, borderWidth: 1, borderColor: '#DCE2EF', borderStyle: 'dashed', backgroundColor: colors.surface },
  photoPreview: { width: 48, height: 48, borderRadius: 11 },
  photoLabel: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  formError: { color: colors.red, fontSize: 12, lineHeight: 18, marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: colors.redSoft },
  privacyNote: { color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 18, marginBottom: 18 },
  submit: { marginBottom: 10 },
});
