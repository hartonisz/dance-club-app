import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from '@/types';

interface VideosState {
  videos: Video[];
  categories: string[];
  savedVideos: string[]; // IDs of videos saved for offline
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchVideos: () => Promise<void>;
  fetchVideosByCategory: (category: string) => Promise<Video[]>;
  saveVideoOffline: (videoId: string) => Promise<void>;
  removeSavedVideo: (videoId: string) => Promise<void>;
  clearError: () => void;
}

export const useVideosStore = create<VideosState>()(
  persist(
    (set, get) => ({
      videos: [],
      categories: ['Basic Steps', 'Technique', 'Choreography', 'Strength Training', 'Flexibility', 'Performance'],
      savedVideos: [],
      isLoading: false,
      error: null,
      
      fetchVideos: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock video data
          const mockVideos: Video[] = [
            {
              id: '1',
              title: 'Basic Waltz Steps',
              description: 'Learn the fundamental steps of Waltz for beginners',
              thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              videoUrl: 'https://example.com/videos/basic-waltz.mp4',
              duration: 360, // 6 minutes
              category: 'Basic Steps',
              tags: ['waltz', 'beginner', 'ballroom'],
              createdAt: '2023-01-15T10:00:00Z',
              createdBy: 'Coach Smith',
            },
            {
              id: '2',
              title: 'Advanced Tango Technique',
              description: 'Improve your Tango with these advanced techniques',
              thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              videoUrl: 'https://example.com/videos/advanced-tango.mp4',
              duration: 720, // 12 minutes
              category: 'Technique',
              tags: ['tango', 'advanced', 'ballroom'],
              createdAt: '2023-02-20T14:30:00Z',
              createdBy: 'Coach Maria',
            },
            {
              id: '3',
              title: 'Salsa Choreography',
              description: 'Learn this exciting Salsa choreography for your next performance',
              thumbnailUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              videoUrl: 'https://example.com/videos/salsa-choreo.mp4',
              duration: 540, // 9 minutes
              category: 'Choreography',
              tags: ['salsa', 'latin', 'choreography'],
              createdAt: '2023-03-10T09:15:00Z',
              createdBy: 'Coach Rodriguez',
            },
            {
              id: '4',
              title: 'Core Strength for Dancers',
              description: 'Essential core exercises to improve your dance performance',
              thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              videoUrl: 'https://example.com/videos/core-strength.mp4',
              duration: 480, // 8 minutes
              category: 'Strength Training',
              tags: ['fitness', 'core', 'strength'],
              createdAt: '2023-04-05T16:45:00Z',
              createdBy: 'Coach Taylor',
            },
            {
              id: '5',
              title: 'Flexibility Routine for Dancers',
              description: 'Improve your flexibility with this daily routine',
              thumbnailUrl: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              videoUrl: 'https://example.com/videos/flexibility.mp4',
              duration: 600, // 10 minutes
              category: 'Flexibility',
              tags: ['stretching', 'flexibility', 'routine'],
              createdAt: '2023-05-12T11:20:00Z',
              createdBy: 'Coach Lisa',
            },
            {
              id: '6',
              title: 'Stage Presence Workshop',
              description: 'Learn how to command the stage during your performances',
              thumbnailUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              videoUrl: 'https://example.com/videos/stage-presence.mp4',
              duration: 900, // 15 minutes
              category: 'Performance',
              tags: ['performance', 'presence', 'workshop'],
              createdAt: '2023-06-18T13:10:00Z',
              createdBy: 'Coach Williams',
            },
          ];
          
          set({ videos: mockVideos, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch videos', isLoading: false });
        }
      },
      
      fetchVideosByCategory: async (category: string) => {
        const { videos } = get();
        return videos.filter(video => video.category === category);
      },
      
      saveVideoOffline: async (videoId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would download the video file
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const { savedVideos } = get();
          if (!savedVideos.includes(videoId)) {
            set({ savedVideos: [...savedVideos, videoId], isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({ error: 'Failed to save video offline', isLoading: false });
        }
      },
      
      removeSavedVideo: async (videoId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would delete the downloaded file
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { savedVideos } = get();
          set({ 
            savedVideos: savedVideos.filter(id => id !== videoId), 
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Failed to remove saved video', isLoading: false });
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'dance-club-videos-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);