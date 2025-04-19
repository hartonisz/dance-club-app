import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useClubInfoStore } from '@/hooks/use-club-info-store';
import { Card } from '@/components/ui/Card';
import { Users, MapPin, Briefcase, ChevronRight } from 'lucide-react-native';

export default function ClubInfoScreen() {
  const router = useRouter();
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
  
  const handleContactsPress = () => {
    router.push('/club-info/contacts');
  };
  
  const handleLocationsPress = () => {
    router.push('/club-info/locations');
  };
  
  const handlePartnersPress = () => {
    router.push('/club-info/partners');
  };
  
  if (!clubInfo && isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading club information...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!clubInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <Text style={styles.errorText}>
            Could not load club information. Pull down to refresh.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
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
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
          style={styles.heroImage}
          contentFit="cover"
          transition={300}
        />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{clubInfo.name}</Text>
        </View>
        
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.description}>{clubInfo.description}</Text>
        </Card>
        
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.description}>{clubInfo.mission}</Text>
        </Card>
        
        <View style={styles.linksSection}>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={handleContactsPress}
            activeOpacity={0.8}
          >
            <View style={styles.linkIconContainer}>
              <Users size={24} color={colors.primary} />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Coaches & Staff</Text>
              <Text style={styles.linkDescription}>
                Meet our professional coaches and staff members
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkCard}
            onPress={handleLocationsPress}
            activeOpacity={0.8}
          >
            <View style={styles.linkIconContainer}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Locations</Text>
              <Text style={styles.linkDescription}>
                Find our dance studios and practice locations
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkCard}
            onPress={handlePartnersPress}
            activeOpacity={0.8}
          >
            <View style={styles.linkIconContainer}>
              <Briefcase size={24} color={colors.primary} />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Partners & Sponsors</Text>
              <Text style={styles.linkDescription}>
                Learn about our partners and sponsors
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
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
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    padding: 24,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
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
  linksSection: {
    padding: 16,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  linkIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});