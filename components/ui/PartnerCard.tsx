import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { Partner } from '@/types';
import { ExternalLink } from 'lucide-react-native';

interface PartnerCardProps {
  partner: Partner;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  const handleWebsitePress = async () => {
    if (partner.website) {
      try {
        await Linking.openURL(partner.website);
      } catch (error) {
        console.error('Could not open website', error);
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: partner.logoUrl }}
          style={styles.logo}
          contentFit="contain"
          transition={300}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{partner.name}</Text>
        
        {partner.description && (
          <Text style={styles.description} numberOfLines={2}>
            {partner.description}
          </Text>
        )}
        
        {partner.website && (
          <TouchableOpacity 
            style={styles.websiteButton} 
            onPress={handleWebsitePress}
          >
            <Text style={styles.websiteText}>Visit Website</Text>
            <ExternalLink size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: '80%',
  },
  content: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  websiteText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});