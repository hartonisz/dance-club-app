import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useTrainingStore } from '@/hooks/use-training-store';
import { useAuthStore } from '@/hooks/use-auth-store';
import { TrainingPlanCard } from '@/components/ui/TrainingPlanCard';
import { TrainingPlan } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dumbbell, Plus } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

export default function TrainingScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    trainingPlans, 
    fetchTrainingPlans, 
    getMyTrainingPlans,
    isLoading,
  } = useTrainingStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (trainingPlans.length === 0) {
      fetchTrainingPlans();
    }
  }, [trainingPlans.length, fetchTrainingPlans]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTrainingPlans();
    setRefreshing(false);
  };
  
  const handlePlanPress = (plan: TrainingPlan) => {
    router.push(`/training/plan/${plan.id}`);
  };
  
  const handleCreatePlan = () => {
    // In a real app, this would navigate to a create plan screen
    alert('Create plan functionality would be implemented here');
  };
  
  const myPlans = getMyTrainingPlans();
  const isCoach = user?.role === 'coach';
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isCoach ? 'Training Plans' : 'My Training Plans'}
        </Text>
        
        {isCoach && (
          <Button
            title="Create"
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} color={colors.white} />}
            onPress={handleCreatePlan}
          />
        )}
      </View>
      
      {isLoading && myPlans.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading training plans...</Text>
        </View>
      ) : myPlans.length === 0 ? (
        <FlatList
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          data={[]}
          renderItem={null}
          ListHeaderComponent={() => (
            <EmptyState
              title={isCoach ? "No training plans created" : "No training plans assigned"}
              description={
                isCoach 
                  ? "Create your first training plan to assign to dancers"
                  : "You don't have any training plans assigned yet"
              }
              icon={<Dumbbell size={40} color={colors.textTertiary} />}
              actionLabel={isCoach ? "Create Plan" : "Refresh"}
              onAction={isCoach ? handleCreatePlan : handleRefresh}
            />
          )}
        />
      ) : (
        <FlatList
          data={myPlans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrainingPlanCard
              plan={item}
              onPress={handlePlanPress}
            />
          )}
          contentContainerStyle={styles.plansList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  plansList: {
    padding: 16,
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
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
});