import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { colors } from '@/constants/colors';
import { Contact } from '@/types';
import { Avatar } from './Avatar';
import { Mail, Phone } from 'lucide-react-native';

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const handleEmailPress = async () => {
    if (contact.email) {
      try {
        await Linking.openURL(`mailto:${contact.email}`);
      } catch (error) {
        console.error('Could not open email app', error);
      }
    }
  };
  
  const handlePhonePress = async () => {
    if (contact.phone) {
      try {
        await Linking.openURL(`tel:${contact.phone}`);
      } catch (error) {
        console.error('Could not open phone app', error);
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <Avatar 
        source={contact.imageUrl} 
        name={contact.name} 
        size="lg" 
      />
      
      <View style={styles.content}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.role}>{contact.role}</Text>
        
        <View style={styles.actions}>
          {contact.email && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleEmailPress}
            >
              <Mail size={18} color={colors.primary} />
              <Text style={styles.actionText}>Email</Text>
            </TouchableOpacity>
          )}
          
          {contact.phone && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handlePhonePress}
            >
              <Phone size={18} color={colors.primary} />
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
          )}
        </View>
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
  role: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.primaryLight + '20', // 20% opacity
    borderRadius: 16,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});