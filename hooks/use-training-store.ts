import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrainingPlan, Exercise } from '@/types';
import { useAuthStore } from './use-auth-store';

interface TrainingState {
  trainingPlans: TrainingPlan[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTrainingPlans: () => Promise<void>;
  addTrainingPlan: (plan: Omit<TrainingPlan, 'id'>) => Promise<TrainingPlan>;
  updateTrainingPlan: (id: string, planData: Partial<TrainingPlan>) => Promise<void>;
  deleteTrainingPlan: (id: string) => Promise<void>;
  assignTrainingPlan: (id: string, userIds: string[]) => Promise<void>;
  
  // Getters
  getTrainingPlanById: (id: string) => TrainingPlan | undefined;
  getTrainingPlansByUser: (userId: string) => TrainingPlan[];
  getMyTrainingPlans: () => TrainingPlan[];
  getTrainingPlansByDate: (date: string) => TrainingPlan[];
  getTrainingPlansByDateRange: (startDate: string, endDate: string) => TrainingPlan[];
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      trainingPlans: [],
      isLoading: false,
      error: null,
      
      fetchTrainingPlans: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock training plans data
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const mockExercises: Exercise[] = [
            {
              id: '1',
              name: 'Warm-up Routine',
              description: 'Full body warm-up to prepare for dance training',
              duration: 15,
            },
            {
              id: '2',
              name: 'Basic Step Drills',
              description: 'Practice basic steps with proper technique',
              duration: 20,
              videoId: '1',
            },
            {
              id: '3',
              name: 'Rumba Technique',
              description: 'Focus on hip action and timing in Rumba',
              duration: 30,
              videoId: '2',
            },
            {
              id: '4',
              name: 'Choreography Practice',
              description: 'Work on competition routine',
              duration: 45,
            },
            {
              id: '5',
              name: 'Cool Down & Stretching',
              description: 'Gentle stretching to improve flexibility',
              duration: 15,
            },
            {
              id: '6',
              name: 'Waltz Technique',
              description: 'Focus on rise and fall in Waltz',
              duration: 30,
              videoId: '3',
            },
            {
              id: '7',
              name: 'Jive Kicks & Flicks',
              description: 'Technique practice for Jive kicks and flicks',
              duration: 25,
              videoId: '4',
            },
            {
              id: '8',
              name: 'Posture & Frame',
              description: 'Exercises to improve dance posture and frame',
              duration: 20,
            },
            {
              id: '9',
              name: 'Strength Training',
              description: 'Dance-specific strength exercises',
              duration: 30,
            },
            {
              id: '10',
              name: 'Balance Exercises',
              description: 'Improve balance for better dance control',
              duration: 15,
            },
          ];
          
          const mockTrainingPlans: TrainingPlan[] = [
            {
              id: '1',
              title: 'Latin Technique Focus',
              description: 'Intensive training session focusing on Latin dance techniques',
              scheduledDate: today.toISOString(),
              exercises: [mockExercises[0], mockExercises[1], mockExercises[2], mockExercises[4]],
              assignedTo: ['3', '4', '5', '7'], // Dancer user IDs
              createdBy: '2', // Coach user ID
            },
            {
              id: '2',
              title: 'Competition Preparation',
              description: 'Final preparation for the upcoming competition',
              scheduledDate: tomorrow.toISOString(),
              exercises: [mockExercises[0], mockExercises[3], mockExercises[4]],
              assignedTo: ['3', '4', '5'], // Dancer user IDs
              createdBy: '2', // Coach user ID
            },
            {
              id: '3',
              title: 'Standard Dance Basics',
              description: 'Focus on fundamental techniques for standard dances',
              scheduledDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
              exercises: [mockExercises[0], mockExercises[5], mockExercises[7], mockExercises[4]],
              assignedTo: ['3', '4', '5', '7'], // Dancer user IDs
              createdBy: '6', // Another coach user ID
            },
            {
              id: '4',
              title: 'Jive & Swing Workshop',
              description: 'Special workshop focusing on Jive and Swing techniques',
              scheduledDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
              exercises: [mockExercises[0], mockExercises[6], mockExercises[9], mockExercises[4]],
              assignedTo: ['3', '7'], // Dancer user IDs
              createdBy: '2', // Coach user ID
            },
            {
              id: '5',
              title: 'Strength & Conditioning',
              description: 'Focus on building strength and endurance for dance',
              scheduledDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
              exercises: [mockExercises[0], mockExercises[8], mockExercises[9], mockExercises[4]],
              assignedTo: ['3', '4', '5', '7'], // Dancer user IDs
              createdBy: '6', // Another coach user ID
            },
          ];
          
          set({ trainingPlans: mockTrainingPlans, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch training plans', 
            isLoading: false 
          });
        }
      },
      
      addTrainingPlan: async (planData: Omit<TrainingPlan, 'id'>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newPlan: TrainingPlan = {
            ...planData,
            id: Math.random().toString(36).substring(2, 9),
          };
          
          set(state => ({
            trainingPlans: [...state.trainingPlans, newPlan],
            isLoading: false,
          }));
          
          return newPlan;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add training plan', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateTrainingPlan: async (id: string, planData: Partial<TrainingPlan>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            trainingPlans: state.trainingPlans.map(plan => 
              plan.id === id ? { ...plan, ...planData } : plan
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update training plan', 
            isLoading: false 
          });
        }
      },
      
      deleteTrainingPlan: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            trainingPlans: state.trainingPlans.filter(plan => plan.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete training plan', 
            isLoading: false 
          });
        }
      },
      
      assignTrainingPlan: async (id: string, userIds: string[]) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            trainingPlans: state.trainingPlans.map(plan => 
              plan.id === id ? { ...plan, assignedTo: userIds } : plan
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to assign training plan', 
            isLoading: false 
          });
        }
      },
      
      getTrainingPlanById: (id) => {
        return get().trainingPlans.find(plan => plan.id === id);
      },
      
      getTrainingPlansByUser: (userId) => {
        return get().trainingPlans.filter(plan => 
          plan.assignedTo?.includes(userId)
        );
      },
      
      getMyTrainingPlans: () => {
        const { user } = useAuthStore.getState();
        
        if (!user) return [];
        
        if (user.role === 'coach') {
          // Coaches see plans they created
          return get().trainingPlans.filter(plan => plan.createdBy === user.id);
        } else {
          // Dancers see plans assigned to them
          return get().trainingPlans.filter(plan => 
            plan.assignedTo?.includes(user.id)
          );
        }
      },
      
      getTrainingPlansByDate: (date) => {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        
        return get().trainingPlans.filter(plan => {
          const planDate = new Date(plan.scheduledDate);
          planDate.setHours(0, 0, 0, 0);
          return planDate.getTime() === targetDate.getTime();
        });
      },
      
      getTrainingPlansByDateRange: (startDate, endDate) => {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        return get().trainingPlans.filter(plan => {
          const planDate = new Date(plan.scheduledDate);
          return planDate >= start && planDate <= end;
        });
      },
    }),
    {
      name: 'rapid-budapest-training-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        trainingPlans: state.trainingPlans,
      }),
    }
  )
);