import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { TrainingPlan } from '@/types';
import { useTrainingStore } from '@/hooks/use-training-store';
import { Dumbbell, Clock, ChevronRight } from 'lucide-react-native';

export const TodayTraining: React.FC = () => {
  const router = useRouter();
  const { trainingPlans, fetchTrainingPlans } = useTrainingStore();
  
  React.useEffect(() => {
    if (trainingPlans.length === 0) {
      fetchTrainingPlans();
    }
  }, [trainingPlans.length, fetchTrainingPlans]);
  
  // Find a training plan scheduled for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTraining = trainingPlans.find(plan => {
    const planDate = new Date(plan.scheduledDate);
    planDate.setHours(0, 0, 0, 0);
    return planDate.getTime() === today.getTime();
  });
  
  const getTotalDuration = (plan: TrainingPlan): number => {
    return plan.exercises.reduce((total, exercise) => total + exercise.duration, 0);
  };
  
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`;
  };
  
  const handlePress = () => {
    if (todayTraining) {
      router.push(`/training/plan/${todayTraining.id}`);
    }
  };
  
  if (!todayTraining) {
    return null;
  }
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Dumbbell size={24} color={colors.white} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.label}>Today's Training</Text>
        <Text style={styles.title} numberOfLines={1}>{todayTraining.title}</Text>
        
        <View style={styles.footer}>
          <View style={styles.durationContainer}>
            <Clock size={14} color={colors.white} />
            <Text style={styles.duration}>
              {formatDuration(getTotalDuration(todayTraining))}
            </Text>
          </View>
          
          <View style={styles.exercisesContainer}>
            <Text style={styles.exercises}>
              {todayTraining.exercises.length} {todayTraining.exercises.length === 1 ? 'exercise' : 'exercises'}
            </Text>
          </View>
        </View>
      </View>
      
      <ChevronRight size={20} color={colors.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white + 'CC', // 80% opacity
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 16,
  },
  duration: {
    fontSize: 14,
    color: colors.white,
  },
  exercisesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exercises: {
    fontSize: 14,
    color: colors.white,
  },
});