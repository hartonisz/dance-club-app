import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useClubInfoStore } from '@/hooks/use-club-info-store';
import { ChevronRight, Info } from 'lucide-react-native';

export const ClubIntro: React.FC = () => {
  const router = useRouter();
  const { clubInfo, fetchClubInfo } = useClubInfoStore();
  
  React.useEffect(() => {
    if (!clubInfo) {
      fetchClubInfo();
    }
  }, [clubInfo, fetchClubInfo]);
  
  const handlePress = () => {
    router.push('/club-info');
  };
  
  if (!clubInfo) {
    return null;
  }
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{clubInfo.name}</Text>
          <Text style={styles.subtitle}>Est. {clubInfo.foundedYear}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {clubInfo.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.infoButton}>
            <Info size={16} color={colors.white} />
            <Text style={styles.infoText}>Club Information</Text>
          </View>
          
          <ChevronRight size={20} color={colors.white} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
    marginBottom: 24,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.white + 'CC', // 80% opacity
  },
  description: {
    fontSize: 16,
    color: colors.white + 'E6', // 90% opacity
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});