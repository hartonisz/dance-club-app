import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressEntry } from '@/types';
import { useAuthStore } from './use-auth-store';

interface ProgressState {
  entries: ProgressEntry[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchEntries: () => Promise<void>;
  addEntry: (entry: Omit<ProgressEntry, 'id'>) => Promise<void>;
  updateEntry: (entryId: string, updates: Partial<ProgressEntry>) => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
  getEntriesByUser: (userId: string) => ProgressEntry[];
  getRecentEntries: (limit?: number) => ProgressEntry[];
  clearError: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      entries: [],
      isLoading: false,
      error: null,
      
      fetchEntries: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          // Mock progress entries
          const mockEntries: ProgressEntry[] = [
            {
              id: '1',
              userId: '1',
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
              title: 'Improved Waltz Technique',
              description: 'Made significant progress with my waltz turns today. Coach noticed the improvement.',
              category: 'Technique',
              rating: 4,
            },
            {
              id: '2',
              userId: '1',
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
              title: 'Flexibility Milestone',
              description: 'Finally achieved full splits! Months of stretching has paid off.',
              category: 'Flexibility',
              rating: 5,
            },
            {
              id: '3',
              userId: '1',
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
              title: 'Tango Choreography',
              description: 'Learned the first half of the new tango choreography. Need more practice on the timing.',
              category: 'Choreography',
              rating: 3,
            },
            {
              id: '4',
              userId: '1',
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
              title: 'Stamina Training',
              description: 'Completed a full 2-hour practice session without getting winded. Cardio training is helping.',
              category: 'Fitness',
              rating: 4,
            },
          ];
          
          set({ entries: mockEntries, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch progress entries', 
            isLoading: false 
          });
        }
      },
      
      addEntry: async (entry: Omit<ProgressEntry, 'id'>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const { entries } = get();
          const newEntry: ProgressEntry = {
            ...entry,
            id: Math.random().toString(36).substring(2, 9),
          };
          
          set({ entries: [newEntry, ...entries], isLoading: false });
        } catch (error) {
          set({ error: 'Failed to add progress entry', isLoading: false });
        }
      },
      
      updateEntry: async (entryId: string, updates: Partial<ProgressEntry>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const { entries } = get();
          const updatedEntries = entries.map(entry => 
            entry.id === entryId ? { ...entry, ...updates } : entry
          );
          
          set({ entries: updatedEntries, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to update progress entry', isLoading: false });
        }
      },
      
      deleteEntry: async (entryId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 600));
          
          const { entries } = get();
          const filteredEntries = entries.filter(entry => entry.id !== entryId);
          
          set({ entries: filteredEntries, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to delete progress entry', isLoading: false });
        }
      },
      
      getEntriesByUser: (userId: string) => {
        const { entries } = get();
        return entries.filter(entry => entry.userId === userId);
      },
      
      getRecentEntries: (limit = 5) => {
        const { entries } = get();
        const user = useAuthStore.getState().user;
        
        if (!user) return [];
        
        return entries
          .filter(entry => entry.userId === user.id)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'dance-club-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);