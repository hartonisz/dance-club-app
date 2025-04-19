import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { Event } from '@/types';
import { Badge } from './Badge';
import { MapPin, Calendar, Bell, BellOff } from 'lucide-react-native';

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
  onToggleReminder?: (event: Event, enabled: boolean) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onToggleReminder,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case 'training':
        return colors.primary;
      case 'competition':
        return colors.error;
      case 'camp':
        return colors.success;
      default:
        return colors.secondary;
    }
  };
  
  const getEventTypeBadge = (type: string) => {
    let label = type.charAt(0).toUpperCase() + type.slice(1);
    let variant: 'primary' | 'error' | 'success' | 'secondary' = 'primary';
    
    switch (type) {
      case 'training':
        variant = 'primary';
        break;
      case 'competition':
        variant = 'error';
        break;
      case 'camp':
        variant = 'success';
        break;
      default:
        variant = 'secondary';
        break;
    }
    
    return <Badge text={label} variant={variant} />;
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(event)}
      activeOpacity={0.8}
    >
      {event.imageUrl ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <View 
            style={[
              styles.typeBadgeContainer, 
              { backgroundColor: getEventTypeColor(event.type) }
            ]}
          >
            {getEventTypeBadge(event.type)}
          </View>
        </View>
      ) : (
        <View style={[styles.noImageContainer, { backgroundColor: getEventTypeColor(event.type) }]}>
          {getEventTypeBadge(event.type)}
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        
        <View style={styles.infoRow}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{formatDate(event.startDate)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
          
          {onToggleReminder && (
            <TouchableOpacity 
              style={styles.reminderButton}
              onPress={() => onToggleReminder(event, !event.isReminded)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              {event.isReminded ? (
                <Bell size={20} color={colors.primary} />
              ) : (
                <BellOff size={20} color={colors.textTertiary} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeBadgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 4,
  },
  noImageContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  reminderButton: {
    padding: 4,
  },
});