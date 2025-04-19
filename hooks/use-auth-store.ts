import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, UserRegistration } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserRegistration) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  
  // Admin actions
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  changeUserRole: (userId: string, role: UserRole) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  getPendingUsers: () => Promise<User[]>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // Simulating API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock login logic - in a real app, validate credentials with backend
          if (email === 'admin@rapid.hu' && password === 'password') {
            const user: User = {
              id: '1',
              name: 'Admin User',
              email: 'admin@rapid.hu',
              role: 'admin',
              joinedAt: new Date().toISOString(),
              profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else if (email === 'coach@rapid.hu' && password === 'password') {
            const user: User = {
              id: '2',
              name: 'Coach Smith',
              email: 'coach@rapid.hu',
              role: 'coach',
              bio: 'Professional dance coach with 15 years of experience',
              joinedAt: new Date().toISOString(),
              profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else if (email === 'dancer@rapid.hu' && password === 'password') {
            const user: User = {
              id: '3',
              name: 'Jane Dancer',
              email: 'dancer@rapid.hu',
              role: 'dancer',
              dateOfBirth: '1995-05-15',
              partner: 'John Partner',
              category: 'Latin - Adult',
              joinedAt: new Date().toISOString(),
              profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ error: 'Invalid email or password', isLoading: false });
          }
        } catch (error) {
          set({ error: 'Login failed. Please try again.', isLoading: false });
        }
      },
      
      register: async (userData: UserRegistration) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock registration
          const newUser: User = {
            id: Math.random().toString(36).substring(2, 9),
            name: userData.name,
            email: userData.email,
            role: userData.role || 'dancer',
            dateOfBirth: userData.dateOfBirth,
            partner: userData.partner,
            category: userData.category,
            joinedAt: new Date().toISOString(),
            approved: userData.role === 'dancer', // Auto-approve dancers, others need admin approval
          };
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Registration failed. Please try again.', isLoading: false });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = get().user;
          if (!currentUser) {
            throw new Error('User not found');
          }
          
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile', 
            isLoading: false 
          });
        }
      },
      
      clearError: () => set({ error: null }),
      
      // Admin actions
      approveUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock implementation - in a real app, this would update the user in the database
          // For now, we'll just return a success message
          set({ isLoading: false });
          return;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to approve user', 
            isLoading: false 
          });
        }
      },
      
      rejectUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock implementation
          set({ isLoading: false });
          return;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to reject user', 
            isLoading: false 
          });
        }
      },
      
      changeUserRole: async (userId: string, role: UserRole) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock implementation
          set({ isLoading: false });
          return;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to change user role', 
            isLoading: false 
          });
        }
      },
      
      getAllUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock users data
          const users: User[] = [
            {
              id: '1',
              name: 'Admin User',
              email: 'admin@rapid.hu',
              role: 'admin',
              joinedAt: new Date().toISOString(),
              approved: true,
              profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            },
            {
              id: '2',
              name: 'Coach Smith',
              email: 'coach@rapid.hu',
              role: 'coach',
              bio: 'Professional dance coach with 15 years of experience',
              joinedAt: new Date().toISOString(),
              approved: true,
              profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            },
            {
              id: '3',
              name: 'Jane Dancer',
              email: 'dancer@rapid.hu',
              role: 'dancer',
              dateOfBirth: '1995-05-15',
              partner: 'John Partner',
              category: 'Latin - Adult',
              joinedAt: new Date().toISOString(),
              approved: true,
              profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            },
            {
              id: '4',
              name: 'Michael Johnson',
              email: 'michael@example.com',
              role: 'dancer',
              dateOfBirth: '1992-08-21',
              partner: 'Sarah Williams',
              category: 'Ballroom - Adult',
              joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              approved: true,
              profileImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            },
            {
              id: '5',
              name: 'Sarah Williams',
              email: 'sarah@example.com',
              role: 'dancer',
              dateOfBirth: '1993-04-12',
              partner: 'Michael Johnson',
              category: 'Ballroom - Adult',
              joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              approved: true,
              profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            },
            {
              id: '6',
              name: 'David Chen',
              email: 'david@example.com',
              role: 'coach',
              bio: 'Specializing in Latin dance with 10+ years of competitive experience',
              joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
              approved: true,
              profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            },
            {
              id: '7',
              name: 'Emma Rodriguez',
              email: 'emma@example.com',
              role: 'dancer',
              dateOfBirth: '1997-11-30',
              category: 'Latin - Youth',
              joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              approved: true,
              profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            },
            {
              id: '8',
              name: 'Robert Taylor',
              email: 'robert@example.com',
              role: 'dancer',
              dateOfBirth: '1990-02-15',
              partner: 'Lisa Brown',
              category: 'Standard - Adult',
              joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
              approved: false,
              profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            },
          ];
          
          set({ isLoading: false });
          return users;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch users', 
            isLoading: false 
          });
          return [];
        }
      },
      
      getPendingUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get all users and filter for pending approvals
          const allUsers = await get().getAllUsers();
          const pendingUsers = allUsers.filter(user => user.approved === false);
          
          set({ isLoading: false });
          return pendingUsers;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch pending users', 
            isLoading: false 
          });
          return [];
        }
      },
    }),
    {
      name: 'rapid-budapest-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);