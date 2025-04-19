import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { Location } from '@/types';
import { MapPin, Navigation } from 'lucide-react-native';

interface LocationCardProps {
  location: Location;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  const handleDirectionsPress = async () => {
    if (location.coordinates) {
      const { latitude, longitude } = location.coordinates;
      const url = Platform.select({
        ios: `maps:?q=${location.name}&ll=${latitude},${longitude}`,
        android: `geo:${latitude},${longitude}?q=${location.name}`,
        web: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      });
      
      try {
        await Linking.openURL(url || '');
      } catch (error) {
        console.error('Could not open maps app', error);
      }
    } else {
      // If no coordinates, try to open with address
      const query = encodeURIComponent(`${location.address}, ${location.city}`);
      const url = Platform.select({
        ios: `maps:?q=${query}`,
        android: `geo:0,0?q=${query}`,
        web: `https://www.google.com/maps/search/?api=1&query=${query}`
      });
      
      try {
        await Linking.openURL(url || '');
      } catch (error) {
        console.error('Could not open maps app', error);
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MapPin size={24} color={colors.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.address}>{location.address}</Text>
        <Text style={styles.city}>{location.city}</Text>
        
        <TouchableOpacity 
          style={styles.directionsButton} 
          onPress={handleDirectionsPress}
        >
          <Navigation size={16} color={colors.primary} />
          <Text style={styles.directionsText}>Get Directions</Text>
        </TouchableOpacity>
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  city: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  directionsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});