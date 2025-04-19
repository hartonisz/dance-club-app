import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useTrainingStore } from '@/hooks/use-training-store';
import { useVideosStore } from '@/hooks/use-videos-store';
import { TrainingPlan, TrainingExercise, Video } from '@/types';
import { Card } from '@/components/ui/Card';
import { 
  Calendar, 
  Clock, 
  Play,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react-native';

export default function TrainingPlanDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { trainingPlans } = useTrainingStore();
  const { videos } = useVideosStore();
  
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  useEffect(() => {
    if (id && trainingPlans.length > 0) {
      const foundPlan = trainingPlans.find(p => p.id === id);
      if (foundPlan) {
        setPlan(foundPlan);
      }
    }
  }, [id, trainingPlans]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleExercisePress = (exercise: TrainingExercise) => {
    if (exercise.videoId) {
      router.push(`/videos/watch/${exercise.videoId}`);
    }
  };
  
  const handleToggleComplete = (exerciseId: string) => {
    setCompletedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
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
  
  const getTotalDuration = (): number => {
    if (!plan) return 0;
    return plan.exercises.reduce((total, exercise) => total + exercise.duration, 0);
  };
  
  const getVideoThumbnail = (videoId?: string): string | undefined => {
    if (!videoId) return undefined;
    
    const video = videos.find(v => v.id === videoId);
    return video?.thumbnailUrl;
  };
  
  const renderExerciseItem = ({ item }: { item: TrainingExercise }) => {
    const isCompleted = completedExercises.includes(item.id);
    const hasVideo = !!item.videoId;
    
    return (
      <TouchableOpacity
        style={[
          styles.exerciseItem,
          isCompleted && styles.exerciseItemCompleted,
        ]}
        onPress={() => handleExercisePress(item)}
        activeOpacity={hasVideo ? 0.7 : 1}
      >
        <View style={styles.exerciseHeader}>
          <Text 
            style={[
              styles.exerciseTitle,
              isCompleted && styles.exerciseTitleCompleted,
            ]}
          >
            {item.title}
          </Text>
          
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleToggleComplete(item.id)}
          >
            <View 
              style={[
                styles.checkCircle,
                isCompleted && styles.checkCircleCompleted,
              ]}
            >
              {isCompleted && <CheckCircle size={20} color={colors.white} />}
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.exerciseDetails}>
          <View style={styles.exerciseInfo}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.exerciseDuration}>
              {formatDuration(item.duration)}
            </Text>
          </View>
          
          {hasVideo && (
            <View style={styles.videoIndicator}>
              <Play size={16} color={colors.primary} />
              <Text style={styles.videoText}>Video available</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.exerciseDescription}>{item.description}</Text>
        
        {item.notes && (
          <Text style={styles.exerciseNotes}>Note: {item.notes}</Text>
        )}
      </TouchableOpacity>
    );
  };
  
  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            headerLeft: () => (
              <TouchableOpacity onPress={handleBack}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }} 
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading training plan...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: plan.title,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.infoCard}>
          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.description}>{plan.description}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Calendar size={18} color={colors.primary} />
              <Text style={styles.metaText}>{formatDate(plan.scheduledDate)}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Clock size={18} color={colors.primary} />
              <Text style={styles.metaText}>{formatDuration(getTotalDuration())}</Text>
            </View>
          </View>
        </Card>
        
        <View style={styles.exercisesContainer}>
          <View style={styles.exercisesHeader}>
            <Text style={styles.exercisesTitle}>Exercises</Text>
            <Text style={styles.exercisesCount}>
              {completedExercises.length} of {plan.exercises.length} completed
            </Text>
          </View>
          
          <FlatList
            data={plan.exercises}
            keyExtractor={(item) => item.id}
            renderItem={renderExerciseItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
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
  infoCard: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  exercisesContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  exercisesCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  exerciseItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  exerciseItemCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10', // 10% opacity
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  exerciseTitleCompleted: {
    color: colors.success,
  },
  completeButton: {
    padding: 4,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  videoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  videoText: {
    fontSize: 14,
    color: colors.primary,
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  exerciseNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textTertiary,
  },
});