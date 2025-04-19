import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { Video } from '@/types';
import { Badge } from './Badge';
import { Clock, Download, CheckCircle } from 'lucide-react-native';

interface VideoCardProps {
  video: Video;
  isSaved?: boolean;
  onPress: (video: Video) => void;
  onSave?: (video: Video) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isSaved = false,
  onPress,
  onSave,
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(video)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnailUrl }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.durationBadge}>
          <Clock size={12} color={colors.white} />
          <Text style={styles.durationText}>{formatDuration(video.duration)}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
          {onSave && (
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={() => onSave(video)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              {isSaved ? (
                <CheckCircle size={20} color={colors.success} />
              ) : (
                <Download size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {video.description}
        </Text>
        
        <View style={styles.footer}>
          <Badge 
            text={video.category} 
            variant="outline" 
            size="sm" 
          />
          <Text style={styles.creator}>By {video.createdBy}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // Full width minus padding

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailContainer: {
    position: 'relative',
    height: cardWidth * 0.5, // 16:9 aspect ratio
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creator: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});