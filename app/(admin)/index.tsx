import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useEventsStore } from '@/hooks/use-events-store';
import { useTrainingStore } from '@/hooks/use-training-store';
import { Card } from '@/components/ui/Card';
import { 
  Users, 
  Calendar, 
  Dumbbell, 
  Clock, 
  UserCheck, 
  UserX, 
  CalendarCheck,
  CalendarClock
} from 'lucide-react-native';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { getAllUsers, getPendingUsers } = useAuthStore();
  const { events, fetchEvents, getUpcomingEvents } = useEventsStore();
  const { trainingPlans, fetchTrainingPlans } = useTrainingStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalTrainingPlans: 0,
    todayTrainingPlans: 0,
  });
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      await Promise.all([
        fetchEvents(),
        fetchTrainingPlans(),
      ]);
      
      const allUsers = await getAllUsers();
      const pendingUsers = await getPendingUsers();
      const upcomingEvents = getUpcomingEvents();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayTraining = trainingPlans.filter(plan => {
        const planDate = new Date(plan.scheduledDate);
        planDate.setHours(0, 0, 0, 0);
        return planDate.getTime() === today.getTime();
      });
      
      setStats({
        totalUsers: allUsers.length,
        pendingUsers: pendingUsers.length,
        totalEvents: events.length,
        upcomingEvents: upcomingEvents.length,
        totalTrainingPlans: trainingPlans.length,
        todayTrainingPlans: todayTraining.length,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>RAPID BUDAPEST SE</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard 
              title="Total Users"
              value={stats.totalUsers}
              icon={<Users size={24} color={colors.primary} />}
              color={colors.primary}
            />
            <StatCard 
              title="Pending Approvals"
              value={stats.pendingUsers}
              icon={<UserCheck size={24} color={colors.warning} />}
              color={colors.warning}
            />
          </View>
          
          <View style={styles.statsRow}>
            <StatCard 
              title="Total Events"
              value={stats.totalEvents}
              icon={<Calendar size={24} color={colors.info} />}
              color={colors.info}
            />
            <StatCard 
              title="Upcoming Events"
              value={stats.upcomingEvents}
              icon={<CalendarClock size={24} color={colors.success} />}
              color={colors.success}
            />
          </View>
          
          <View style={styles.statsRow}>
            <StatCard 
              title="Training Plans"
              value={stats.totalTrainingPlans}
              icon={<Dumbbell size={24} color={colors.secondary} />}
              color={colors.secondary}
            />
            <StatCard 
              title="Today's Training"
              value={stats.todayTrainingPlans}
              icon={<Clock size={24} color={colors.tertiary} />}
              color={colors.tertiary}
            />
          </View>
        </View>
        
        <Card style={styles.quickActionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <QuickActionButton 
              title="Manage Users"
              icon={<Users size={20} color={colors.white} />}
              route="/users"
              color={colors.primary}
            />
            <QuickActionButton 
              title="Add Event"
              icon={<CalendarCheck size={20} color={colors.white} />}
              route="/events/add"
              color={colors.info}
            />
            <QuickActionButton 
              title="Create Training"
              icon={<Dumbbell size={20} color={colors.white} />}
              route="/training/add"
              color={colors.secondary}
            />
            <QuickActionButton 
              title="Pending Approvals"
              icon={<UserCheck size={20} color={colors.white} />}
              route="/users/pending"
              color={colors.warning}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIconContainer}>
        {icon}
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </Card>
  );
};

interface QuickActionButtonProps {
  title: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ title, icon, route, color }) => {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(route);
  };
  
  return (
    <TouchableOpacity 
      style={[styles.quickActionButton, { backgroundColor: color }]}
      onPress={handlePress}
    >
      <View style={styles.quickActionIcon}>
        {icon}
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    padding: 16,
    borderLeftWidth: 4,
  },
  statIconContainer: {
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  quickActionsCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  quickActionIcon: {
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});