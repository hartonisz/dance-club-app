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
import { useEventsStore } from '@/hooks/use-events-store';
import { Event } from '@/types';
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  Clock, 
  Tag,
  ChevronRight
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminEventsScreen() {
  const router = useRouter();
  const { events, fetchEvents, deleteEvent, isLoading } = useEventsStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadEvents();
  }, []);
  
  const loadEvents = async () => {
    await fetchEvents();
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };
  
  const handleAddEvent = () => {
    router.push('/events/add');
  };
  
  const handleEditEvent = (event: Event) => {
    router.push(`/events/edit/${event.id}`);
  };
  
  const handleDeleteEvent = (event: Event) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.title}"?`,
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
              await deleteEvent(event.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  const renderEventItem = ({ item }: { item: Event }) => {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };
    
    const dateRange = startDate.toDateString() === endDate.toDateString()
      ? formatDate(startDate)
      : `${formatDate(startDate)} - ${formatDate(endDate)}`;
    
    return (
      <Card style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <View style={styles.eventTypeContainer}>
            <Text style={[
              styles.eventType, 
              { 
                backgroundColor: 
                  item.type === 'competition' ? colors.error + '20' :
                  item.type === 'workshop' ? colors.info + '20' :
                  item.type === 'meeting' ? colors.warning + '20' :
                  colors.success + '20',
                color: 
                  item.type === 'competition' ? colors.error :
                  item.type === 'workshop' ? colors.info :
                  item.type === 'meeting' ? colors.warning :
                  colors.success,
              }
            ]}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
          <View style={styles.eventActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleEditEvent(item)}
            >
              <Edit2 size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeleteEvent(item)}
            >
              <Trash2 size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.eventDetailText}>{dateRange}</Text>
          </View>
          
          <View style={styles.eventDetailItem}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={styles.eventDetailText} numberOfLines={1}>{item.location}</Text>
          </View>
          
          {item.categories && item.categories.length > 0 && (
            <View style={styles.eventDetailItem}>
              <Tag size={16} color={colors.textSecondary} />
              <Text style={styles.eventDetailText}>
                {item.categories.join(', ')}
              </Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => router.push(`/calendar/event/${item.id}`)}
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
        <Text style={styles.title}>Events Management</Text>
        <Button
          title="Add Event"
          onPress={handleAddEvent}
          leftIcon={<Plus size={18} color={colors.white} />}
          style={styles.addButton}
        />
      </View>
      
      {events.length === 0 ? (
        <EmptyState
          title="No Events"
          description="Add your first event to get started"
          icon={<Calendar size={40} color={colors.textTertiary} />}
          actionButton={
            <Button
              title="Add Event"
              onPress={handleAddEvent}
              leftIcon={<Plus size={18} color={colors.white} />}
            />
          }
        />
      ) : (
        <FlatList
          data={events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
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
  eventCard: {
    marginBottom: 16,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTypeContainer: {
    flexDirection: 'row',
  },
  eventType: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  eventActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
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