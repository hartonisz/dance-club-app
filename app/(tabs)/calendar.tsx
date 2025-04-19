import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useEventsStore } from '@/hooks/use-events-store';
import { EventCard } from '@/components/ui/EventCard';
import { Event } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react-native';

export default function CalendarScreen() {
  const router = useRouter();
  const { events, fetchEvents, toggleReminder, isLoading } = useEventsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  useEffect(() => {
    if (events.length === 0) {
      fetchEvents();
    }
  }, [events.length, fetchEvents]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };
  
  const handleEventPress = (event: Event) => {
    router.push(`/calendar/event/${event.id}`);
  };
  
  const handleToggleReminder = async (event: Event, enabled: boolean) => {
    await toggleReminder(event.id, enabled);
  };
  
  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };
  
  const getEventsForMonth = (): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      );
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  };
  
  const monthEvents = getEventsForMonth();
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.monthSelector}>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={handlePreviousMonth}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>{formatMonthYear(currentMonth)}</Text>
        
        <TouchableOpacity
          style={styles.monthButton}
          onPress={handleNextMonth}
        >
          <ChevronRight size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {isLoading && events.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : monthEvents.length === 0 ? (
        <FlatList
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          data={[]}
          renderItem={null}
          ListHeaderComponent={() => (
            <EmptyState
              title="No events this month"
              description="There are no scheduled events for this month. Try checking another month."
              icon={<CalendarIcon size={40} color={colors.textTertiary} />}
              actionLabel="Refresh"
              onAction={handleRefresh}
            />
          )}
        />
      ) : (
        <FlatList
          data={monthEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={handleEventPress}
              onToggleReminder={handleToggleReminder}
            />
          )}
          contentContainerStyle={styles.eventsList}
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
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  eventsList: {
    padding: 16,
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