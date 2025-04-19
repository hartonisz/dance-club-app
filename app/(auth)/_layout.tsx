import { Stack, useRootNavigationState, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();
  const rootNavigationState = useRootNavigationState();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if the root navigation is ready and user is authenticated
    if (rootNavigationState?.key && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router, rootNavigationState?.key]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.white,
        },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}