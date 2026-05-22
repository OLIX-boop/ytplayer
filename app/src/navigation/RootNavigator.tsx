import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Icon, IconName } from '@/components/Icon';
import { MiniPlayer } from '@/components/MiniPlayer';
import { SearchScreen } from '@/screens/SearchScreen';
import { QueueScreen } from '@/screens/QueueScreen';
import { LibraryScreen } from '@/screens/LibraryScreen';
import { PlayerScreen } from '@/screens/PlayerScreen';
import { colors, layout } from '@/theme';
import type { MainTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return <Icon name={name} size={24} color={focused ? colors.accent : colors.textMuted} />;
}

function TabBarBackground() {
  if (Platform.OS === 'ios') {
    return (
      <BlurView tint="dark" intensity={70} style={StyleSheet.absoluteFill} />
    );
  }
  return <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bgElevated }]} />;
}

function MainTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            height: layout.tabBarHeight,
            borderTopWidth: 0,
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.bgElevated,
            position: 'absolute',
            elevation: 0,
          },
          tabBarBackground: () => <TabBarBackground />,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: 'Cerca',
            tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Queue"
          component={QueueScreen}
          options={{
            tabBarLabel: 'Coda',
            tabBarIcon: ({ focused }) => <TabIcon name="queue" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            tabBarLabel: 'Libreria',
            tabBarIcon: ({ focused }) => <TabIcon name="library" focused={focused} />,
          }}
        />
      </Tab.Navigator>
      <MiniPlayer />
    </View>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}
