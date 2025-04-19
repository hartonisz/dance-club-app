import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/use-auth-store';
import { User, UserRole } from '@/types';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Edit2, 
  Mail,
  Calendar,
  Tag,
  ChevronRight,
  Shield
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Avatar } from '@/components/ui/Avatar';

export default function AdminUsersScreen() {
  const router = useRouter();
  const { getAllUsers, changeUserRole, approveUser, rejectUser, isLoading } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    const allUsers = await getAllUsers();
    setUsers(allUsers);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };
  
  const handleViewPendingUsers = () => {
    router.push('/users/pending');
  };
  
  const handleChangeRole = (user: User, newRole: UserRole) => {
    Alert.alert(
      'Change User Role',
      `Are you sure you want to change ${user.name}'s role to ${newRole}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Change',
          onPress: async () => {
            try {
              await changeUserRole(user.id, newRole);
              // Update local state
              setUsers(prevUsers => 
                prevUsers.map(u => 
                  u.id === user.id ? { ...u, role: newRole } : u
                )
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to change user role. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  const handleApproveUser = (user: User) => {
    Alert.alert(
      'Approve User',
      `Are you sure you want to approve ${user.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              await approveUser(user.id);
              // Update local state
              setUsers(prevUsers => 
                prevUsers.map(u => 
                  u.id === user.id ? { ...u, approved: true } : u
                )
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to approve user. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  const handleRejectUser = (user: User) => {
    Alert.alert(
      'Reject User',
      `Are you sure you want to reject ${user.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await rejectUser(user.id);
              // Update local state
              setUsers(prevUsers => 
                prevUsers.filter(u => u.id !== user.id)
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to reject user. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  const renderUserItem = ({ item }: { item: User }) => {
    return (
      <Card style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Avatar 
              source={item.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'}
              size="lg"
              name={item.name}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.name}</Text>
              <View style={styles.roleContainer}>
                <Shield size={14} color={
                  item.role === 'admin' ? colors.error :
                  item.role === 'coach' ? colors.warning :
                  colors.success
                } />
                <Text style={[
                  styles.userRole,
                  {
                    color: 
                      item.role === 'admin' ? colors.error :
                      item.role === 'coach' ? colors.warning :
                      colors.success
                  }
                ]}>
                  {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.userStatus}>
            {item.approved === false ? (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            ) : null}
          </View>
        </View>
        
        <View style={styles.userContactInfo}>
          <View style={styles.contactItem}>
            <Mail size={16} color={colors.textSecondary} />
            <Text style={styles.contactText}>{item.email}</Text>
          </View>
          
          {item.dateOfBirth && (
            <View style={styles.contactItem}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={styles.contactText}>{item.dateOfBirth}</Text>
            </View>
          )}
          
          {item.category && (
            <View style={styles.contactItem}>
              <Tag size={16} color={colors.textSecondary} />
              <Text style={styles.contactText}>{item.category}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          {item.approved === false ? (
            <>
              <Button
                title="Approve"
                onPress={() => handleApproveUser(item)}
                leftIcon={<UserCheck size={16} color={colors.white} />}
                style={[styles.actionButton, styles.approveButton]}
                textStyle={styles.actionButtonText}
              />
              <Button
                title="Reject"
                onPress={() => handleRejectUser(item)}
                leftIcon={<UserX size={16} color={colors.white} />}
                style={[styles.actionButton, styles.rejectButton]}
                textStyle={styles.actionButtonText}
              />
            </>
          ) : (
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  item.role === 'dancer' ? styles.activeRoleButton : null
                ]}
                onPress={() => handleChangeRole(item, 'dancer')}
              >
                <Text style={[
                  styles.roleButtonText,
                  item.role === 'dancer' ? styles.activeRoleButtonText : null
                ]}>
                  Dancer
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  item.role === 'coach' ? styles.activeRoleButton : null
                ]}
                onPress={() => handleChangeRole(item, 'coach')}
              >
                <Text style={[
                  styles.roleButtonText,
                  item.role === 'coach' ? styles.activeRoleButtonText : null
                ]}>
                  Coach
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  item.role === 'admin' ? styles.activeRoleButton : null
                ]}
                onPress={() => handleChangeRole(item, 'admin')}
              >
                <Text style={[
                  styles.roleButtonText,
                  item.role === 'admin' ? styles.activeRoleButtonText : null
                ]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Card>
    );
  };
  
  const pendingUsersCount = users.filter(user => user.approved === false).length;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Users Management</Text>
        {pendingUsersCount > 0 && (
          <Button
            title={`Pending (${pendingUsersCount})`}
            onPress={handleViewPendingUsers}
            leftIcon={<UserCheck size={18} color={colors.white} />}
            style={styles.pendingButton}
          />
        )}
      </View>
      
      {users.length === 0 ? (
        <EmptyState
          title="No Users"
          description="There are no users in the system yet"
          icon={<Users size={40} color={colors.textTertiary} />}
        />
      ) : (
        <FlatList
          data={users.sort((a, b) => {
            // Sort by approval status first (pending first)
            if ((a.approved === false) !== (b.approved === false)) {
              return a.approved === false ? -1 : 1;
            }
            // Then sort by role (admin, coach, dancer)
            if (a.role !== b.role) {
              if (a.role === 'admin') return -1;
              if (b.role === 'admin') return 1;
              if (a.role === 'coach') return -1;
              if (b.role === 'coach') return 1;
            }
            // Finally sort by name
            return a.name.localeCompare(b.name);
          })}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  pendingButton: {
    height: 40,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  userCard: {
    marginBottom: 16,
    padding: 16,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  userStatus: {
    flexDirection: 'row',
  },
  pendingBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.warning,
  },
  userContactInfo: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 14,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeRoleButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeRoleButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
});