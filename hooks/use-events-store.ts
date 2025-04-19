import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '@/types';

interface EventsState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleReminder: (id: string, enabled: boolean) => Promise<void>;
  
  // Getters
  getUpcomingEvents: (limit?: number) => Event[];
  getEventById: (id: string) => Event | undefined;
  getEventsByCategory: (category: string) => Event[];
  getEventsByDateRange: (startDate: string, endDate: string) => Event[];
}

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      events: [],
      isLoading: false,
      error: null,
      
      fetchEvents: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock events data
          const mockEvents: Event[] = [
            {
              id: '1',
              title: 'WDSF International Open Latin',
              description: 'International Latin dance competition with participants from over 20 countries.',
              startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
              endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(), // 16 days from now
              location: 'Budapest Sports Arena, Budapest',
              type: 'competition',
              categories: ['Latin', 'Adult'],
              reminderEnabled: true,
              createdBy: '1', // Admin user
            },
            {
              id: '2',
              title: 'Weekend Workshop: Advanced Techniques',
              description: 'Intensive weekend workshop focusing on advanced dance techniques and choreography.',
              startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
              endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
              location: 'RAPID Studio, Váci Street, Budapest',
              type: 'workshop',
              categories: ['Latin', 'Ballroom', 'All Levels'],
              reminderEnabled: false,
              createdBy: '2', // Coach user
            },
            {
              id: '3',
              title: 'Club Meeting: Season Planning',
              description: 'Annual club meeting to discuss the upcoming season, competitions, and events.',
              startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
              endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Same day
              location: 'RAPID Office, Budapest',
              type: 'meeting',
              reminderEnabled: true,
              createdBy: '1', // Admin user
            },
            {
              id: '4',
              title: 'Hungarian National Championship',
              description: 'The annual Hungarian National Dance Sport Championship for all age categories.',
              startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
              endDate: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000).toISOString(), // 47 days from now
              location: 'National Dance Arena, Budapest',
              type: 'competition',
              categories: ['Standard', 'Latin', 'All Ages'],
              reminderEnabled: false,
              createdBy: '1', // Admin user
            },
            {
              id: '5',
              title: 'Beginner Showcase',
              description: 'Performance opportunity for beginner dancers to showcase their progress.',
              startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Same day
              location: 'RAPID Studio, Váci Street, Budapest',
              type: 'other',
              categories: ['Beginner'],
              reminderEnabled: true,
              createdBy: '2', // Coach user
            },
          ];
          
          set({ events: mockEvents, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch events', 
            isLoading: false 
          });
        }
      },
      
      addEvent: async (eventData: Omit<Event, 'id'>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newEvent: Event = {
            ...eventData,
            id: Math.random().toString(36).substring(2, 9),
          };
          
          set(state => ({
            events: [...state.events, newEvent],
            isLoading: false,
          }));
          
          return newEvent;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add event', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateEvent: async (id: string, eventData: Partial<Event>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            events: state.events.map(event => 
              event.id === id ? { ...event, ...eventData } : event
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update event', 
            isLoading: false 
          });
        }
      },
      
      deleteEvent: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            events: state.events.filter(event => event.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete event', 
            isLoading: false 
          });
        }
      },
      
      toggleReminder: async (id: string, enabled: boolean) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            events: state.events.map(event => 
              event.id === id ? { ...event, reminderEnabled: enabled } : event
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to toggle reminder', 
            isLoading: false 
          });
        }
      },
      
      getUpcomingEvents: (limit) => {
        const { events } = get();
        const now = new Date();
        
        // Filter events that haven't ended yet
        const upcomingEvents = events
          .filter(event => new Date(event.endDate) >= now)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        
        return limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
      },
      
      getEventById: (id) => {
        return get().events.find(event => event.id === id);
      },
      
      getEventsByCategory: (category) => {
        return get().events.filter(event => 
          event.categories?.includes(category)
        );
      },
      
      getEventsByDateRange: (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return get().events.filter(event => {
          const eventStart = new Date(event.startDate);
          const eventEnd = new Date(event.endDate);
          
          // Check if the event overlaps with the date range
          return (eventStart <= end && eventEnd >= start);
        });
      },
    }),
    {
      name: 'rapid-budapest-events-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        events: state.events,
      }),
    }
  )
);