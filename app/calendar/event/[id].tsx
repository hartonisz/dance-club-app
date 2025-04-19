import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { useEventsStore } from '@/hooks/use-events-store';
import { Event } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Bell, 
  BellOff,
  Share2,
  ArrowLeft,
} from 'lucide-react-native';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { events, toggleReminder } = useEventsStore();
  
  const [event, setEvent] = useState<Event | null>(null);
  
  useEffect(() => {
    if (id && events.length > 0) {
      const foundEvent = events.find(e => e.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
      }
    }
  }, [id, events]);
  
  const handleToggleReminder = async () => {
    if (!event) return;
    
    await toggleReminder(event.id, !event.isReminded);
    
    // Update local state
    setEvent(prev => {
      if (!prev) return null;
      return { ...prev, isReminded: !prev.isReminded };
    });
  };
  
  const handleShare = async () => {
    if (!event) return;
    
    if (Platform.OS === 'web') {
      alert('Sharing is not available on web');
      return;
    }
    
    try {
      const message = `Check out this event: ${event.title} on ${formatDate(event.startDate)} at ${event.location}`;
      await Linking.openURL(`sms:&body=${encodeURIComponent(message)}`);
    } catch (error) {
      console.error('Error sharing event:', error);
      Alert.alert('Error', 'Could not share the event');
    }
  };
  
  const handleGetDirections = async () => {
    if (!event) return;
    
    const query = encodeURIComponent(event.location);
    const url = Platform.select({
      ios: `maps:?q=${query}`,
      android: `geo:0,0?q=${query}`,
      web: `https://www.google.com/maps/search/?api=1&query=${query}`
    });
    
    try {
      await Linking.openURL(url || '');
    } catch (error) {
      console.error('Could not open maps app', error);
      Alert.alert('Error', 'Could not open maps application');
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
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
    
    return <Badge text={label} variant={variant} size="md" />;
  };
  
  if (!event) {
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
          <Text style={styles.loadingText}>Loading event...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: event.title,
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
        {event.imageUrl ? (
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View 
            style={[
              styles.noImage, 
              { backgroundColor: getEventTypeColor(event.type) }
            ]}
          >
            {getEventTypeBadge(event.type)}
          </View>
        )}
        
        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{event.title}</Text>
            {getEventTypeBadge(event.type)}
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Calendar size={20} color={colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailText}>{formatDate(event.startDate)}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <Clock size={20} color={colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailText}>
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <MapPin size={20} color={colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <Button
              title={event.isReminded ? "Remove Reminder" : "Set Reminder"}
              variant={event.isReminded ? "outline" : "primary"}
              leftIcon={
                event.isReminded 
                  ? <BellOff size={18} color={colors.primary} /> 
                  : <Bell size={18} color={colors.white} />
              }
              onPress={handleToggleReminder}
              style={styles.actionButton}
            />
            
            <Button
              title="Get Directions"
              variant="secondary"
              leftIcon={<MapPin size={18} color={colors.white} />}
              onPress={handleGetDirections}
              style={styles.actionButton}
            />
            
            <Button
              title="Share"
              variant="outline"
              leftIcon={<Share2 size={18} color={colors.primary} />}
              onPress={handleShare}
              style={styles.actionButton}
            />
          </View>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
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
  image: {
    width: '100%',
    height: 200,
  },
  noImage: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailTextContainer: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 16,
    color: colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
  },
  descriptionContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});