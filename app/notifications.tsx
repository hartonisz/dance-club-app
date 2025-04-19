import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useNotificationsStore } from '@/hooks/use-notifications-store';
import { Notification } from '@/types';
import { NotificationItem } from '@/components/ui/NotificationItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Bell, CheckCheck, ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

export default function NotificationsScreen() {
  const router = useRouter();
  const { 
    notifications, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    getUnreadCount,
    isLoading,
  } = useNotificationsStore();
  
  const [refreshing, setRefreshing] = React.useState(false);
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };
  
  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.type === 'video' && notification.relatedId) {
      router.push(`/videos/watch/${notification.relatedId}`);
    } else if (notification.type === 'event' && notification.relatedId) {
      router.push(`/calendar/event/${notification.relatedId}`);
    } else if (notification.type === 'training' && notification.relatedId) {
      router.push(`/training/plan/${notification.relatedId}`);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const unreadCount = getUnreadCount();
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      {unreadCount > 0 && (
        <View style={styles.header}>
          <Text style={styles.unreadCount}>
            {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
          </Text>
          
          <Button
            title="Mark All as Read"
            variant="ghost"
            size="sm"
            leftIcon={<CheckCheck size={16} color={colors.primary} />}
            onPress={handleMarkAllAsRead}
          />
        </View>
      )}
      
      {isLoading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <FlatList
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          data={[]}
          renderItem={null}
          ListHeaderComponent={() => (
            <EmptyState
              title="No notifications"
              description="You don't have any notifications yet"
              icon={<Bell size={40} color={colors.textTertiary} />}
              actionLabel="Refresh"
              onAction={handleRefresh}
            />
          )}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={handleNotificationPress}
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unreadCount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
});