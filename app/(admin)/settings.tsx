import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Switch,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useClubInfoStore } from '@/hooks/use-club-info-store';
import { useAuthStore } from '@/hooks/use-auth-store';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  Settings, 
  Building, 
  Calendar, 
  Users, 
  MapPin, 
  Handshake,
  Facebook,
  Instagram,
  Youtube,
  ChevronRight,
  Save,
  Globe
} from 'lucide-react-native';

export default function AdminSettingsScreen() {
  const { clubInfo, fetchClubInfo, updateClubInfo, isLoading } = useClubInfoStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    foundedYear: '',
    mission: '',
    facebook: '',
    instagram: '',
    youtube: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    loadClubInfo();
  }, []);
  
  useEffect(() => {
    if (clubInfo) {
      setFormData({
        name: clubInfo.name,
        description: clubInfo.description,
        foundedYear: clubInfo.foundedYear.toString(),
        mission: clubInfo.mission,
        facebook: clubInfo.socialMedia.facebook || '',
        instagram: clubInfo.socialMedia.instagram || '',
        youtube: clubInfo.socialMedia.youtube || '',
      });
    }
  }, [clubInfo]);
  
  const loadClubInfo = async () => {
    if (!clubInfo) {
      await fetchClubInfo();
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    // Reset form data to original values
    if (clubInfo) {
      setFormData({
        name: clubInfo.name,
        description: clubInfo.description,
        foundedYear: clubInfo.foundedYear.toString(),
        mission: clubInfo.mission,
        facebook: clubInfo.socialMedia.facebook || '',
        instagram: clubInfo.socialMedia.instagram || '',
        youtube: clubInfo.socialMedia.youtube || '',
      });
    }
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    if (!clubInfo) return;
    
    setIsSaving(true);
    
    try {
      const updatedInfo = {
        name: formData.name,
        description: formData.description,
        foundedYear: parseInt(formData.foundedYear),
        mission: formData.mission,
        socialMedia: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          youtube: formData.youtube,
        },
      };
      
      await updateClubInfo(updatedInfo);
      setIsEditing(false);
      Alert.alert('Success', 'Club information updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update club information');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  if (!clubInfo) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading club information...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Club Settings</Text>
          {!isEditing ? (
            <Button
              title="Edit"
              onPress={handleEdit}
              style={styles.editButton}
            />
          ) : (
            <View style={styles.editActions}>
              <Button
                title="Cancel"
                onPress={handleCancel}
                style={[styles.actionButton, styles.cancelButton]}
                textStyle={styles.cancelButtonText}
              />
              <Button
                title="Save"
                onPress={handleSave}
                isLoading={isSaving}
                leftIcon={<Save size={18} color={colors.white} />}
                style={styles.actionButton}
              />
            </View>
          )}
        </View>
        
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          {isEditing ? (
            <View style={styles.formSection}>
              <Input
                label="Club Name"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                leftIcon={<Building size={20} color={colors.textSecondary} />}
              />
              
              <Input
                label="Founded Year"
                value={formData.foundedYear}
                onChangeText={(text) => handleInputChange('foundedYear', text)}
                keyboardType="number-pad"
                leftIcon={<Calendar size={20} color={colors.textSecondary} />}
              />
              
              <Input
                label="Description"
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <Input
                label="Mission"
                value={formData.mission}
                onChangeText={(text) => handleInputChange('mission', text)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          ) : (
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Building size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Club Name</Text>
                  <Text style={styles.infoValue}>{clubInfo.name}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Calendar size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Founded</Text>
                  <Text style={styles.infoValue}>{clubInfo.foundedYear}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Globe size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{clubInfo.description}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Users size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Mission</Text>
                  <Text style={styles.infoValue}>{clubInfo.mission}</Text>
                </View>
              </View>
            </View>
          )}
        </Card>
        
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          
          {isEditing ? (
            <View style={styles.formSection}>
              <Input
                label="Facebook"
                value={formData.facebook}
                onChangeText={(text) => handleInputChange('facebook', text)}
                placeholder="https://www.facebook.com/..."
                leftIcon={<Facebook size={20} color={colors.textSecondary} />}
              />
              
              <Input
                label="Instagram"
                value={formData.instagram}
                onChangeText={(text) => handleInputChange('instagram', text)}
                placeholder="https://www.instagram.com/..."
                leftIcon={<Instagram size={20} color={colors.textSecondary} />}
              />
              
              <Input
                label="YouTube"
                value={formData.youtube}
                onChangeText={(text) => handleInputChange('youtube', text)}
                placeholder="https://www.youtube.com/..."
                leftIcon={<Youtube size={20} color={colors.textSecondary} />}
              />
            </View>
          ) : (
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Facebook size={20} color="#1877F2" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Facebook</Text>
                  <Text style={styles.infoValue}>
                    {clubInfo.socialMedia.facebook || 'Not set'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Instagram size={20} color="#E1306C" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Instagram</Text>
                  <Text style={styles.infoValue}>
                    {clubInfo.socialMedia.instagram || 'Not set'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Youtube size={20} color="#FF0000" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>YouTube</Text>
                  <Text style={styles.infoValue}>
                    {clubInfo.socialMedia.youtube || 'Not set'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Card>
        
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Manage Club Information</Text>
          
          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navItemContent}>
              <Users size={20} color={colors.primary} />
              <Text style={styles.navItemText}>Manage Coaches & Staff</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navItemContent}>
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.navItemText}>Manage Locations</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navItemContent}>
              <Handshake size={20} color={colors.primary} />
              <Text style={styles.navItemText}>Manage Partners & Sponsors</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>
      </ScrollView>
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
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  editButton: {
    height: 40,
    paddingHorizontal: 16,
  },
  editActions: {
    flexDirection: 'row',
  },
  actionButton: {
    height: 40,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoSection: {
    
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
  },
  formSection: {
    
  },
  navItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
});