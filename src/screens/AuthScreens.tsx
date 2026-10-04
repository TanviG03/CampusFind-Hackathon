import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { useCampusFind } from '../context/CampusFindContext';
import { RootStackParamList } from '../types';
import { colors } from '../theme';

type AuthNavigation = NativeStackNavigationProp<RootStackParamList>;

export function SplashScreen() {
  const navigation = useNavigation<AuthNavigation>();
  return (
    <AppScreen contentStyle={styles.splash}>
      <View style={styles.brandMark}>
        <MaterialCommunityIcons name="magnify" size={38} color="#FFFFFF" />
        <View style={styles.brandDot} />
      </View>
      <Text style={styles.brand}>CampusFind</Text>
      <Text style={styles.tagline}>Lost something? Find your way back to it.</Text>
      <View style={styles.splashBottom}>
        <Text style={styles.splashNote}>A little help from your campus community.</Text>
        <PrimaryButton title="Get started" onPress={() => navigation.navigate('Login')} />
        <Text onPress={() => navigation.navigate('SignUp')} style={styles.splashLink}>
          New to CampusFind? <Text style={styles.linkStrong}>Create an account</Text>
        </Text>
      </View>
    </AppScreen>
  );
}

function AuthField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={label === 'Email address' ? 'none' : 'words'}
        keyboardType={label === 'Email address' ? 'email-address' : 'default'}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

export function LoginScreen() {
  const navigation = useNavigation<AuthNavigation>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const continueToApp = () => {
    if (!email.trim() || !password.trim() || !isValidEmail(email)) {
      setFormError('Enter a valid email address and password to continue.');
      return;
    }
    setFormError('');
    navigation.replace('MainTabs');
  };

  return (
    <AppScreen contentStyle={styles.authContent}>
      <Text onPress={() => navigation.navigate('Splash')} style={styles.backLink}>‹  CampusFind</Text>
      <View style={styles.authIcon}>
        <MaterialCommunityIcons name="account-outline" size={27} color={colors.primary} />
      </View>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to reconnect with your things.</Text>
      <View style={styles.form}>
        <AuthField label="Email address" placeholder="you@college.edu" value={email} onChangeText={setEmail} />
        <AuthField label="Password" placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />
      </View>
      {!!formError && <Text accessibilityRole="alert" style={styles.formError}>{formError}</Text>}
      <PrimaryButton title="Sign in" onPress={continueToApp} />
      <Text style={styles.demoNote}>Demo sign-in: enter any email and password</Text>
      <Text onPress={() => navigation.navigate('SignUp')} style={styles.switchAuth}>
        Don’t have an account? <Text style={styles.linkStrong}>Sign up</Text>
      </Text>
    </AppScreen>
  );
}

export function SignUpScreen() {
  const navigation = useNavigation<AuthNavigation>();
  const { setUserName } = useCampusFind();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const createAccount = () => {
    if (!name.trim() || !email.trim() || !password.trim() || !isValidEmail(email)) {
      setFormError('Enter your name, a valid email address, and password to continue.');
      return;
    }
    setFormError('');
    setUserName(name.trim());
    navigation.replace('MainTabs');
  };

  return (
    <AppScreen contentStyle={styles.authContent}>
      <Text onPress={() => navigation.navigate('Login')} style={styles.backLink}>‹  Back to sign in</Text>
      <View style={styles.authIcon}>
        <MaterialCommunityIcons name="account-plus-outline" size={27} color={colors.primary} />
      </View>
      <Text style={styles.title}>Join your campus</Text>
      <Text style={styles.subtitle}>Create an account to post and recover items.</Text>
      <View style={styles.form}>
        <AuthField label="Full name" placeholder="Your name" value={name} onChangeText={setName} />
        <AuthField label="Email address" placeholder="you@college.edu" value={email} onChangeText={setEmail} />
        <AuthField label="Password" placeholder="Create a password" value={password} onChangeText={setPassword} secureTextEntry />
      </View>
      {!!formError && <Text accessibilityRole="alert" style={styles.formError}>{formError}</Text>}
      <PrimaryButton title="Create account" onPress={createAccount} />
      <Text style={styles.demoNote}>Demo sign-up stores your name for this session only.</Text>
      <Text onPress={() => navigation.navigate('Login')} style={styles.switchAuth}>
        Already a member? <Text style={styles.linkStrong}>Sign in</Text>
      </Text>
    </AppScreen>
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const styles = StyleSheet.create({
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  brandMark: {
    width: 88, height: 88, borderRadius: 29, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 22,
    boxShadow: '0px 8px 16px rgba(51, 68, 168, 0.2)',
  },
  brandDot: { position: 'absolute', width: 11, height: 11, borderRadius: 6, backgroundColor: '#FFB861', right: 17, top: 17 },
  brand: { color: colors.ink, fontSize: 31, fontWeight: '800', letterSpacing: -0.9 },
  tagline: { color: colors.muted, fontSize: 15, textAlign: 'center', marginTop: 9, lineHeight: 23 },
  splashBottom: { width: '100%', marginTop: 'auto', gap: 16, paddingBottom: 24 },
  splashNote: { color: colors.muted, textAlign: 'center', fontSize: 13, marginBottom: 2, lineHeight: 20 },
  splashLink: { textAlign: 'center', color: colors.muted, fontSize: 13, padding: 7 },
  authContent: { flexGrow: 1, paddingTop: 16, paddingBottom: 28 },
  backLink: { color: colors.primary, fontWeight: '700', fontSize: 14, marginBottom: 32, paddingVertical: 4 },
  authIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.primarySoft, justifyContent: 'center', alignItems: 'center', marginBottom: 19 },
  title: { color: colors.ink, fontSize: 29, fontWeight: '800', letterSpacing: -0.7 },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 8, lineHeight: 22 },
  form: { gap: 18, marginTop: 30, marginBottom: 24 },
  fieldWrap: { gap: 9 },
  fieldLabel: { color: colors.ink, fontSize: 13, fontWeight: '700', letterSpacing: 0.1 },
  input: { height: 54, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: 15, paddingHorizontal: 16, color: colors.ink, fontSize: 14 },
  formError: { color: colors.red, fontSize: 12, lineHeight: 18, marginTop: -12, marginBottom: 14, padding: 12, borderRadius: 12, backgroundColor: colors.redSoft },
  demoNote: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: 12 },
  switchAuth: { textAlign: 'center', color: colors.muted, fontSize: 13, marginTop: 22, padding: 6 },
  linkStrong: { color: colors.primary, fontWeight: '700' },
});
