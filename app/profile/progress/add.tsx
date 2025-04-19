import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useProgressStore } from '@/hooks/use-progress-store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus, Star } from 'lucide-react-native';

export default function AddProgressScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addEntry, isLoading, error, clearError } = useProgressStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  
  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add progress');
      return;
    }
    
    if (!title || !description || !category) {
      Alert.alert('Error', 'Title, description, and category are required');
      return;
    }
    
    await addEntry({
      userId: user.id,
      date: new Date().toISOString(),
      title,
      description,
      category,
      rating: rating || undefined,
    });
    
    if (!error) {
      router.back();
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleRatingPress = (value: number) => {
    setRating(value === rating ? null : value);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Track Your Progress</Text>
          <Text style={styles.subtitle}>
            Record your dance achievements and improvements
          </Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <Input
            label="Title"
            placeholder="e.g. Improved Waltz Technique"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (error) clearError();
            }}
          />
          
          <Input
            label="Description"
            placeholder="Describe your progress or achievement"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (error) clearError();
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            inputStyle={styles.descriptionInput}
          />
          
          <Input
            label="Category"
            placeholder="e.g. Technique, Flexibility, Performance"
            value={category}
            onChangeText={(text) => {
              setCategory(text);
              if (error) clearError();
            }}
          />
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rating (Optional)</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleRatingPress(value)}
                  style={styles.starButton}
                >
                  <Star
                    size={32}
                    fill={value <= (rating || 0) ? colors.warning : 'none'}
                    color={value <= (rating || 0) ? colors.warning : colors.textTertiary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <Button
            title="Save Progress"
            onPress={handleSave}
            isLoading={isLoading}
            leftIcon={<Plus size={18} color={colors.white} />}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: colors.error + '20', // 20% opacity
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  descriptionInput: {
    height: 100,
    paddingTop: 12,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  saveButton: {
    marginTop: 16,
  },
});