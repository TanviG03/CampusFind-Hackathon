import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { MainTabParamList, RootStackParamList } from '../types';
import { LoginScreen, SignUpScreen, SplashScreen } from '../screens/AuthScreens';
import { BrowseScreen, HomeScreen, MyReportsScreen } from '../screens/MainScreens';
import { ItemDetailsScreen } from '../screens/ItemDetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ReportFoundScreen, ReportLostScreen } from '../screens/ReportScreens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Home: 'home-variant-outline',
  Browse: 'magnify',
  MyReports: 'clipboard-text-outline',
  Profile: 'account-outline',
};

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 72,
          paddingTop: 9,
          paddingBottom: 9,
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          boxShadow: '0px -3px 9px rgba(23, 36, 58, 0.05)',
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 2 },
        tabBarIconStyle: { marginBottom: 0 },
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name={tabIcons[route.name]} color={color} size={size} />
        ),
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Browse" component={BrowseScreen} />
      <Tabs.Screen name="MyReports" component={MyReportsScreen} options={{ tabBarLabel: 'My Reports' }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ReportLost" component={ReportLostScreen} />
      <Stack.Screen name="ReportFound" component={ReportFoundScreen} />
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
    </Stack.Navigator>
  );
}
