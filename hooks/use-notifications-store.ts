import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '@/types';

interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
  getUnreadCount: () => number;
  clearError: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      error: null,
      
      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock notifications
          const mockNotifications: Notification[] = [
            {
              id: '1',
              title: 'New Training Video',
              message: 'A new waltz technique video has been added to the library',
              type: 'video',
              relatedId: '1',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              isRead: false,
            },
            {
              id: '2',
              title: 'Upcoming Competition',
              message: 'Don\'t forget about the Regional Dance Competition next week',
              type: 'event',
              relatedId: '3',
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              isRead: true,
            },
            {
              id: '3',
              title: 'New Training Plan',
              message: 'Coach Smith has assigned you a new training plan',
              type: 'training',
              relatedId: '1',
              createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              isRead: false,
            },
            {
              id: '4',
              title: 'Venue Change',
              message: 'Tomorrow\'s practice has been moved to Studio B due to renovations',
              type: 'system',
              createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              isRead: false,
            },
            {
              id: '5',
              title: 'Workshop Registration Open',
              message: 'Registration is now open for the Latin Dance Workshop',
              type: 'event',
              relatedId: '2',
              createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              isRead: false,
            },
          ];
          
          set({ notifications: mockNotifications, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch notifications', isLoading: false });
        }
      },
      
      markAsRead: async (notificationId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { notifications } = get();
          const updatedNotifications = notifications.map(notification => 
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          );
          
          set({ notifications: updatedNotifications, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to mark notification as read', isLoading: false });
        }
      },
      
      markAllAsRead: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const { notifications } = get();
          const updatedNotifications = notifications.map(notification => ({ 
            ...notification, 
            isRead: true 
          }));
          
          set({ notifications: updatedNotifications, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to mark all notifications as read', isLoading: false });
        }
      },
      
      deleteNotification: async (notificationId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { notifications } = get();
          const filteredNotifications = notifications.filter(
            notification => notification.id !== notificationId
          );
          
          set({ notifications: filteredNotifications, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to delete notification', isLoading: false });
        }
      },
      
      addNotification: async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { notifications } = get();
          const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
            isRead: false,
          };
          
          set({ 
            notifications: [newNotification, ...notifications], 
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Failed to add notification', isLoading: false });
        }
      },
      
      getUnreadCount: () => {
        const { notifications } = get();
        return notifications.filter(notification => !notification.isRead).length;
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'dance-club-notifications-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);