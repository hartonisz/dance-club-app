import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { useVideosStore } from '@/hooks/use-videos-store';
import { Video } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Play, 
  Download, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Tag,
  ArrowLeft,
} from 'lucide-react-native';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { videos, savedVideos, saveVideoOffline, removeSavedVideo } = useVideosStore();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [isVideoSaved, setIsVideoSaved] = useState(false);
  
  useEffect(() => {
    if (id && videos.length > 0) {
      const foundVideo = videos.find(v => v.id === id);
      if (foundVideo) {
        setVideo(foundVideo);
      }
    }
  }, [id, videos]);
  
  useEffect(() => {
    if (id && savedVideos.includes(id as string)) {
      setIsVideoSaved(true);
    } else {
      setIsVideoSaved(false);
    }
  }, [id, savedVideos]);
  
  const handleSaveVideo = async () => {
    if (!video) return;
    
    if (isVideoSaved) {
      await removeSavedVideo(video.id);
    } else {
      await saveVideoOffline(video.id);
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (!video) {
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
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: video.title,
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
        <View style={styles.videoContainer}>
          <Image
            source={{ uri: video.thumbnailUrl }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={300}
          />
          
          <View style={styles.playButtonContainer}>
            <TouchableOpacity style={styles.playButton}>
              <Play size={32} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{video.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{formatDuration(video.duration)}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{formatDate(video.createdAt)}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Tag size={16} color={colors.textSecondary} />
              <Badge text={video.category} variant="outline" size="sm" />
            </View>
          </View>
          
          <Button
            title={isVideoSaved ? "Saved for Offline" : "Save for Offline"}
            variant={isVideoSaved ? "outline" : "primary"}
            leftIcon={
              isVideoSaved 
                ? <CheckCircle size={18} color={colors.primary} /> 
                : <Download size={18} color={colors.white} />
            }
            onPress={handleSaveVideo}
            style={styles.saveButton}
          />
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>{video.description}</Text>
          </View>
          
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsTitle}>Tags</Text>
            <View style={styles.tags}>
              {video.tags.map((tag, index) => (
                <Badge
                  key={index}
                  text={tag}
                  variant="outline"
                  size="md"
                  style={styles.tag}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.creatorContainer}>
            <Text style={styles.creatorTitle}>Created by</Text>
            <Text style={styles.creator}>{video.createdBy}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

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
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: width * 0.5625, // 16:9 aspect ratio
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  saveButton: {
    marginBottom: 16,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    marginBottom: 4,
  },
  creatorContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  creatorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  creator: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});