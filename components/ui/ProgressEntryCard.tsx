import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { ProgressEntry } from '@/types';
import { Calendar, Star } from 'lucide-react-native';
import { Badge } from './Badge';

interface ProgressEntryCardProps {
  entry: ProgressEntry;
  onPress?: (entry: ProgressEntry) => void;
}

export const ProgressEntryCard: React.FC<ProgressEntryCardProps> = ({
  entry,
  onPress,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const renderRating = () => {
    if (!entry.rating) return null;
    
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= entry.rating! ? colors.warning : 'none'}
            color={star <= entry.rating! ? colors.warning : colors.textTertiary}
          />
        ))}
      </View>
    );
  };
  
  const CardContent = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{entry.title}</Text>
        <Badge text={entry.category} variant="outline" size="sm" />
      </View>
      
      <View style={styles.dateContainer}>
        <Calendar size={14} color={colors.textSecondary} />
        <Text style={styles.date}>{formatDate(entry.date)}</Text>
      </View>
      
      <Text style={styles.description}>{entry.description}</Text>
      
      {renderRating()}
    </>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress(entry)}
        activeOpacity={0.8}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={styles.container}>
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
});