import React, { useEffect } from 'react';
import { Tabs, useRouter, useRootNavigationState } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/use-auth-store';
import { 
  Home, 
  Calendar, 
  Dumbbell, 
  Users, 
  Bell, 
  Settings,
  LogOut
} from 'lucide-react-native';
import { useNotificationsStore } from '@/hooks/use-notifications-store';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function AdminTabLayout() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { notifications, fetchNotifications, getUnreadCount } = useNotificationsStore();
  const rootNavigationState = useRootNavigationState();
  
  useEffect(() => {
    // Only redirect if the root navigation is ready and user is not authenticated
    if (rootNavigationState?.key && !isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }
    
    // If user is not an admin, redirect to regular tabs
    if (rootNavigationState?.key && isAuthenticated && user?.role !== 'admin') {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user, router, rootNavigationState?.key]);
  
  useEffect(() => {
    if (isAuthenticated && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isAuthenticated, notifications.length, fetchNotifications]);
  
  const unreadCount = getUnreadCount();
  
  const handleNotificationsPress = () => {
    router.push('/notifications');
  };
  
  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };
  
  const NotificationButton = () => (
    <TouchableOpacity
      onPress={handleNotificationsPress}
      style={styles.notificationButton}
    >
      <Bell size={24} color={colors.text} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
  
  const LogoutButton = () => (
    <TouchableOpacity
      onPress={handleLogout}
      style={styles.logoutButton}
    >
      <LogOut size={24} color={colors.text} />
    </TouchableOpacity>
  );
  
  // Don't render tabs until we know the authentication state and navigation is ready
  if (!rootNavigationState?.key || !isAuthenticated || user?.role !== 'admin') {
    return null;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.white,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerRight: () => (
          <View style={styles.headerButtons}>
            <NotificationButton />
            <LogoutButton />
          </View>
        ),
        headerRightContainerStyle: {
          paddingRight: 16,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: "Training",
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 8,
  },
  logoutButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
});