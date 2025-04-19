import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useEventsStore } from '@/hooks/use-events-store';
import { useVideosStore } from '@/hooks/use-videos-store';
import { useTrainingStore } from '@/hooks/use-training-store';
import { useClubInfoStore } from '@/hooks/use-club-info-store';
import { ClubIntro } from '@/components/home/ClubIntro';
import { TodayTraining } from '@/components/home/TodayTraining';
import { UpcomingEvents } from '@/components/home/UpcomingEvents';
import { RecentVideos } from '@/components/home/RecentVideos';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { fetchEvents } = useEventsStore();
  const { fetchVideos } = useVideosStore();
  const { fetchTrainingPlans } = useTrainingStore();
  const { fetchClubInfo } = useClubInfoStore();
  
  const [refreshing, setRefreshing] = React.useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    await Promise.all([
      fetchEvents(),
      fetchVideos(),
      fetchTrainingPlans(),
      fetchClubInfo(),
    ]);
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
        <ClubIntro />
        
        <TodayTraining />
        
        <UpcomingEvents />
        
        <RecentVideos />
      </ScrollView>
    </SafeAreaView>
  );
}

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
});