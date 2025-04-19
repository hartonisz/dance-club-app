import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useClubInfoStore } from '@/hooks/use-club-info-store';
import { LocationCard } from '@/components/ui/LocationCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { MapPin } from 'lucide-react-native';

export default function LocationsScreen() {
  const { clubInfo, fetchClubInfo, isLoading } = useClubInfoStore();
  
  const [refreshing, setRefreshing] = React.useState(false);
  
  useEffect(() => {
    if (!clubInfo) {
      fetchClubInfo();
    }
  }, [clubInfo, fetchClubInfo]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClubInfo();
    setRefreshing(false);
  };
  
  if (!clubInfo && isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading locations...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!clubInfo || clubInfo.locations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
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
              title="No locations available"
              description="Location information is not available at the moment"
              icon={<MapPin size={40} color={colors.textTertiary} />}
              actionLabel="Refresh"
              onAction={handleRefresh}
            />
          )}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={clubInfo.locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LocationCard location={item} />
        )}
        contentContainerStyle={styles.list}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
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
  list: {
    padding: 16,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
});