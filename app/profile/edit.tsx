import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { User, Mail, Calendar, Users, Award, ArrowLeft, Save } from 'lucide-react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [partner, setPartner] = useState('');
  const [category, setCategory] = useState('');
  const [bio, setBio] = useState('');
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setDateOfBirth(user.dateOfBirth || '');
      setPartner(user.partner || '');
      setCategory(user.category || '');
      setBio(user.bio || '');
    }
  }, [user]);
  
  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    
    await updateProfile({
      name,
      email,
      dateOfBirth,
      partner,
      category,
      bio,
    });
    
    if (!error) {
      router.back();
    }
  };
  
  const handleBack = () => {
    router.back();
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
          <View style={styles.avatarContainer}>
            <Avatar
              source={user?.avatar}
              name={name || user?.name}
              size="xl"
            />
            
            <TouchableOpacity style={styles.changeAvatarButton}>
              <Text style={styles.changeAvatarText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) clearError();
            }}
            leftIcon={<User size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) clearError();
            }}
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            leftIcon={<Calendar size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Dance Partner"
            placeholder="Partner's name"
            value={partner}
            onChangeText={setPartner}
            leftIcon={<Users size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Dance Category"
            placeholder="e.g. Latin - Adult"
            value={category}
            onChangeText={setCategory}
            leftIcon={<Award size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Bio"
            placeholder="Tell us about yourself"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            inputStyle={styles.bioInput}
          />
          
          <Button
            title="Save Changes"
            onPress={handleSave}
            isLoading={isLoading}
            leftIcon={<Save size={18} color={colors.white} />}
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  changeAvatarButton: {
    marginTop: 8,
  },
  changeAvatarText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
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
  bioInput: {
    height: 100,
    paddingTop: 12,
  },
  saveButton: {
    marginTop: 16,
  },
});