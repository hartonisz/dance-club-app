import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { TrainingPlan } from '@/types';
import { Calendar, Clock, ChevronRight } from 'lucide-react-native';

interface TrainingPlanCardProps {
  plan: TrainingPlan;
  onPress: (plan: TrainingPlan) => void;
}

export const TrainingPlanCard: React.FC<TrainingPlanCardProps> = ({
  plan,
  onPress,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getTotalDuration = (): number => {
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
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(plan)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{plan.title}</Text>
        <ChevronRight size={20} color={colors.textSecondary} />
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {plan.description}
      </Text>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Calendar size={16} color={colors.primary} />
          <Text style={styles.statText}>{formatDate(plan.scheduledDate)}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Clock size={16} color={colors.primary} />
          <Text style={styles.statText}>{formatDuration(getTotalDuration())}</Text>
        </View>
      </View>
      
      <View style={styles.exercisesList}>
        <Text style={styles.exercisesTitle}>
          {plan.exercises.length} {plan.exercises.length === 1 ? 'Exercise' : 'Exercises'}
        </Text>
        
        {plan.exercises.slice(0, 2).map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <View style={styles.exerciseDot} />
            <Text style={styles.exerciseName} numberOfLines={1}>
              {exercise.title}
            </Text>
          </View>
        ))}
        
        {plan.exercises.length > 2 && (
          <Text style={styles.moreExercises}>
            +{plan.exercises.length - 2} more
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  exercisesList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  exercisesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  exerciseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  exerciseName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  moreExercises: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
});