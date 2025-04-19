import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useVideosStore } from '@/hooks/use-videos-store';
import { VideoCard } from '@/components/ui/VideoCard';
import { Video } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { Play, Download, Filter } from 'lucide-react-native';

export default function VideosScreen() {
  const router = useRouter();
  const { 
    videos, 
    categories, 
    savedVideos, 
    fetchVideos, 
    saveVideoOffline, 
    removeSavedVideo,
    isLoading,
  } = useVideosStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (videos.length === 0) {
      fetchVideos();
    }
  }, [videos.length, fetchVideos]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchVideos();
    setRefreshing(false);
  };
  
  const handleVideoPress = (video: Video) => {
    router.push(`/videos/watch/${video.id}`);
  };
  
  const handleSaveVideo = async (video: Video) => {
    if (savedVideos.includes(video.id)) {
      await removeSavedVideo(video.id);
    } else {
      await saveVideoOffline(video.id);
    }
  };
  
  const handleCategoryPress = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  const handleToggleSavedOnly = () => {
    setShowSavedOnly(!showSavedOnly);
  };
  
  const filteredVideos = videos.filter(video => {
    if (showSavedOnly && !savedVideos.includes(video.id)) {
      return false;
    }
    
    if (selectedCategory && video.category !== selectedCategory) {
      return false;
    }
    
    return true;
  });
  
  const renderCategoryItem = ({ item }: { item: string | null }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.categoryItemSelected,
      ]}
      onPress={() => handleCategoryPress(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.categoryTextSelected,
        ]}
      >
        {item === null ? 'All' : item}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              showSavedOnly && styles.filterButtonActive,
            ]}
            onPress={handleToggleSavedOnly}
          >
            <Download size={16} color={showSavedOnly ? colors.white : colors.primary} />
            <Text
              style={[
                styles.filterButtonText,
                showSavedOnly && styles.filterButtonTextActive,
              ]}
            >
              Saved
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={renderCategoryItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
        ListHeaderComponent={() => renderCategoryItem({ item: null })}
      />
      
      {isLoading && filteredVideos.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      ) : filteredVideos.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <EmptyState
            title={showSavedOnly ? "No saved videos" : "No videos found"}
            description={
              showSavedOnly
                ? "You haven't saved any videos for offline viewing yet"
                : "Try selecting a different category or check back later"
            }
            icon={<Play size={40} color={colors.textTertiary} />}
            actionLabel={showSavedOnly ? "View All Videos" : "Refresh"}
            onAction={showSavedOnly ? () => setShowSavedOnly(false) : handleRefresh}
          />
        </ScrollView>
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VideoCard
              video={item}
              isSaved={savedVideos.includes(item.id)}
              onPress={handleVideoPress}
              onSave={handleSaveVideo}
            />
          )}
          contentContainerStyle={styles.videosList}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.white,
  },
  categoryItemSelected: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  categoryTextSelected: {
    color: colors.white,
  },
  videosList: {
    padding: 16,
    paddingTop: 8,
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