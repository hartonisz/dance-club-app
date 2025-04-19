import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useProgressStore } from '@/hooks/use-progress-store';
import { ProgressEntry } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Calendar, 
  Star, 
  Edit, 
  Trash2,
  ArrowLeft,
} from 'lucide-react-native';

export default function ProgressDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { entries, deleteEntry, isLoading } = useProgressStore();
  
  const [entry, setEntry] = useState<ProgressEntry | null>(null);
  
  useEffect(() => {
    if (id && entries.length > 0) {
      const foundEntry = entries.find(e => e.id === id);
      if (foundEntry) {
        setEntry(foundEntry);
      }
    }
  }, [id, entries]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleEdit = () => {
    // In a real app, this would navigate to an edit screen
    Alert.alert('Edit', 'Edit functionality would be implemented here');
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this progress entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            if (entry) {
              await deleteEntry(entry.id);
              router.back();
            }
          },
          style: 'destructive',
        },
      ]
    );
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
  
  if (!entry) {
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
          <Text style={styles.loadingText}>Loading progress entry...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: entry.title,
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
        <View style={styles.header}>
          <Text style={styles.title}>{entry.title}</Text>
          <Badge text={entry.category} variant="outline" size="md" />
        </View>
        
        <View style={styles.dateContainer}>
          <Calendar size={18} color={colors.primary} />
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
        </View>
        
        {entry.rating && (
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                fill={star <= entry.rating! ? colors.warning : 'none'}
                color={star <= entry.rating! ? colors.warning : colors.textTertiary}
              />
            ))}
          </View>
        )}
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{entry.description}</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Edit"
            variant="outline"
            leftIcon={<Edit size={18} color={colors.primary} />}
            onPress={handleEdit}
            style={styles.actionButton}
          />
          
          <Button
            title="Delete"
            variant="outline"
            leftIcon={<Trash2 size={18} color={colors.error} />}
            onPress={handleDelete}
            style={[styles.actionButton, styles.deleteButton]}
            textStyle={{ color: colors.error }}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  date: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    borderColor: colors.error,
  },
});