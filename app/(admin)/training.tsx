import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useTrainingStore } from '@/hooks/use-training-store';
import { TrainingPlan } from '@/types';
import { 
  Dumbbell, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock, 
  Users,
  ChevronRight
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminTrainingScreen() {
  const router = useRouter();
  const { trainingPlans, fetchTrainingPlans, deleteTrainingPlan, isLoading } = useTrainingStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadTrainingPlans();
  }, []);
  
  const loadTrainingPlans = async () => {
    await fetchTrainingPlans();
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrainingPlans();
    setRefreshing(false);
  };
  
  const handleAddTrainingPlan = () => {
    router.push('/training/add');
  };
  
  const handleEditTrainingPlan = (plan: TrainingPlan) => {
    router.push(`/training/edit/${plan.id}`);
  };
  
  const handleDeleteTrainingPlan = (plan: TrainingPlan) => {
    Alert.alert(
      'Delete Training Plan',
      `Are you sure you want to delete "${plan.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTrainingPlan(plan.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete training plan. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  const renderTrainingPlanItem = ({ item }: { item: TrainingPlan }) => {
    const scheduledDate = new Date(item.scheduledDate);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    };
    
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
    
    const isToday = () => {
      const today = new Date();
      return scheduledDate.toDateString() === today.toDateString();
    };
    
    const isPast = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return scheduledDate < today;
    };
    
    return (
      <Card style={styles.trainingCard}>
        <View style={styles.trainingHeader}>
          <View style={styles.dateContainer}>
            {isToday() ? (
              <View style={[styles.dateBadge, styles.todayBadge]}>
                <Text style={styles.todayText}>Today</Text>
              </View>
            ) : isPast() ? (
              <View style={[styles.dateBadge, styles.pastBadge]}>
                <Text style={styles.pastText}>Past</Text>
              </View>
            ) : (
              <View style={styles.dateBadge}>
                <Text style={styles.dateText}>Upcoming</Text>
              </View>
            )}
          </View>
          <View style={styles.trainingActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleEditTrainingPlan(item)}
            >
              <Edit2 size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeleteTrainingPlan(item)}
            >
              <Trash2 size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.trainingTitle}>{item.title}</Text>
        <Text style={styles.trainingDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.trainingDetails}>
          <View style={styles.trainingDetailItem}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={styles.trainingDetailText}>{formatDate(scheduledDate)}</Text>
          </View>
          
          <View style={styles.trainingDetailItem}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.trainingDetailText}>
              {formatDuration(getTotalDuration(item))}
            </Text>
          </View>
          
          <View style={styles.trainingDetailItem}>
            <Dumbbell size={16} color={colors.textSecondary} />
            <Text style={styles.trainingDetailText}>
              {item.exercises.length} {item.exercises.length === 1 ? 'exercise' : 'exercises'}
            </Text>
          </View>
          
          {item.assignedTo && item.assignedTo.length > 0 && (
            <View style={styles.trainingDetailItem}>
              <Users size={16} color={colors.textSecondary} />
              <Text style={styles.trainingDetailText}>
                {item.assignedTo.length} {item.assignedTo.length === 1 ? 'dancer' : 'dancers'} assigned
              </Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => router.push(`/training/plan/${item.id}`)}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </Card>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Management</Text>
        <Button
          title="Add Training"
          onPress={handleAddTrainingPlan}
          leftIcon={<Plus size={18} color={colors.white} />}
          style={styles.addButton}
        />
      </View>
      
      {trainingPlans.length === 0 ? (
        <EmptyState
          title="No Training Plans"
          description="Add your first training plan to get started"
          icon={<Dumbbell size={40} color={colors.textTertiary} />}
          actionButton={
            <Button
              title="Add Training Plan"
              onPress={handleAddTrainingPlan}
              leftIcon={<Plus size={18} color={colors.white} />}
            />
          }
        />
      ) : (
        <FlatList
          data={trainingPlans.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())}
          keyExtractor={(item) => item.id}
          renderItem={renderTrainingPlanItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
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
    backgroundColor: colors.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    height: 40,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  trainingCard: {
    marginBottom: 16,
    padding: 16,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  dateBadge: {
    backgroundColor: colors.info + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  todayBadge: {
    backgroundColor: colors.primary + '20',
  },
  pastBadge: {
    backgroundColor: colors.textTertiary + '20',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.info,
  },
  todayText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  pastText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  trainingActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  trainingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  trainingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  trainingDetails: {
    marginBottom: 16,
  },
  trainingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trainingDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
});