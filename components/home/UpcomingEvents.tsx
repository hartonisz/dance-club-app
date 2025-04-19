import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Event } from '@/types';
import { useEventsStore } from '@/hooks/use-events-store';
import { EventCard } from '@/components/ui/EventCard';
import { Calendar, ChevronRight } from 'lucide-react-native';
import { EmptyState } from '@/components/ui/EmptyState';

export const UpcomingEvents: React.FC = () => {
  const router = useRouter();
  const { getUpcomingEvents, toggleReminder } = useEventsStore();
  const upcomingEvents = getUpcomingEvents(3);
  
  const handleEventPress = (event: Event) => {
    router.push(`/calendar/event/${event.id}`);
  };
  
  const handleToggleReminder = async (event: Event, enabled: boolean) => {
    await toggleReminder(event.id, enabled);
  };
  
  const handleViewAllPress = () => {
    router.push('/calendar');
  };
  
  if (upcomingEvents.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.title}>Upcoming Events</Text>
          </View>
        </View>
        
        <EmptyState
          title="No upcoming events"
          description="Check back later for upcoming events and competitions"
          icon={<Calendar size={40} color={colors.textTertiary} />}
          style={styles.emptyState}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Calendar size={20} color={colors.primary} />
          <Text style={styles.title}>Upcoming Events</Text>
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
        data={upcomingEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={handleEventPress}
            onToggleReminder={handleToggleReminder}
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