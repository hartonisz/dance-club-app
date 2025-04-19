import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useProgressStore } from '@/hooks/use-progress-store';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressEntryCard } from '@/components/ui/ProgressEntryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressEntry } from '@/types';
import { 
  User, 
  Calendar, 
  Award, 
  Edit, 
  LogOut, 
  Plus, 
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { 
    entries, 
    fetchEntries, 
    getRecentEntries,
    isLoading: isProgressLoading,
  } = useProgressStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (entries.length === 0) {
      fetchEntries();
    }
  }, [entries.length, fetchEntries]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };
  
  const handleEditProfile = () => {
    router.push('/profile/edit');
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleAddProgress = () => {
    router.push('/profile/progress/add');
  };
  
  const handleProgressEntryPress = (entry: ProgressEntry) => {
    router.push(`/profile/progress/${entry.id}`);
  };
  
  const handleViewAllProgress = () => {
    // In a real app, this would navigate to a progress history screen
    alert('View all progress functionality would be implemented here');
  };
  
  const recentEntries = getRecentEntries(3);
  
  if (!user) {
    return null;
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.profileHeader}>
          <Avatar
            source={user.avatar}
            name={user.name}
            size="xl"
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.role}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
            
            <View style={styles.profileActions}>
              <Button
                title="Edit Profile"
                variant="outline"
                size="sm"
                leftIcon={<Edit size={16} color={colors.primary} />}
                onPress={handleEditProfile}
                style={styles.editButton}
              />
              
              <Button
                title="Logout"
                variant="ghost"
                size="sm"
                leftIcon={<LogOut size={16} color={colors.error} />}
                onPress={handleLogout}
                textStyle={{ color: colors.error }}
              />
            </View>
          </View>
        </View>
        
        <Card style={styles.detailsCard} variant="outlined">
          {user.category && (
            <View style={styles.detailItem}>
              <Award size={20} color={colors.primary} />
              <Text style={styles.detailText}>{user.category}</Text>
            </View>
          )}
          
          {user.dateOfBirth && (
            <View style={styles.detailItem}>
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.detailText}>
                Born: {new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}
          
          {user.partner && (
            <View style={styles.detailItem}>
              <User size={20} color={colors.primary} />
              <Text style={styles.detailText}>Partner: {user.partner}</Text>
            </View>
          )}
        </Card>
        
        <View style={styles.progressSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <TrendingUp size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Progress Tracking</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={handleViewAllProgress}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <Button
            title="Add Progress Entry"
            variant="primary"
            leftIcon={<Plus size={18} color={colors.white} />}
            onPress={handleAddProgress}
            style={styles.addButton}
          />
          
          {isProgressLoading && recentEntries.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading progress entries...</Text>
            </View>
          ) : recentEntries.length === 0 ? (
            <EmptyState
              title="No progress entries yet"
              description="Start tracking your dance progress by adding your first entry"
              icon={<TrendingUp size={40} color={colors.textTertiary} />}
              style={styles.emptyState}
            />
          ) : (
            recentEntries.map(entry => (
              <ProgressEntryCard
                key={entry.id}
                entry={entry}
                onPress={() => handleProgressEntryPress(entry)}
              />
            ))
          )}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    flexDirection: 'row',
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
  profileInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    borderColor: colors.primary,
  },
  detailsCard: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: colors.text,
  },
  progressSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
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
  addButton: {
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
  },
});