import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Video } from '@/types';
import { useVideosStore } from '@/hooks/use-videos-store';
import { VideoCard } from '@/components/ui/VideoCard';
import { Play, ChevronRight } from 'lucide-react-native';
import { EmptyState } from '@/components/ui/EmptyState';

export const RecentVideos: React.FC = () => {
  const router = useRouter();
  const { videos, savedVideos, saveVideoOffline, fetchVideos } = useVideosStore();
  
  React.useEffect(() => {
    if (videos.length === 0) {
      fetchVideos();
    }
  }, [videos.length, fetchVideos]);
  
  const recentVideos = videos.slice(0, 2);
  
  const handleVideoPress = (video: Video) => {
    router.push(`/videos/watch/${video.id}`);
  };
  
  const handleSaveVideo = async (video: Video) => {
    await saveVideoOffline(video.id);
  };
  
  const handleViewAllPress = () => {
    router.push('/videos');
  };
  
  if (recentVideos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Play size={20} color={colors.primary} />
            <Text style={styles.title}>Recent Videos</Text>
          </View>
        </View>
        
        <EmptyState
          title="No videos available"
          description="Check back later for new training videos"
          icon={<Play size={40} color={colors.textTertiary} />}
          style={styles.emptyState}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Play size={20} color={colors.primary} />
          <Text style={styles.title}>Recent Videos</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={handleViewAllPress}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={recentVideos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            isSaved={savedVideos.includes(item.id)}
            onPress={handleVideoPress}
            onSave={handleSaveVideo}
          />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
  },
});