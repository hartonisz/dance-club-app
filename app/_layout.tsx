import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.card,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="club-info" 
        options={{ 
          title: "Club Information",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="club-info/contacts" 
        options={{ 
          title: "Coaches & Staff",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="club-info/locations" 
        options={{ 
          title: "Locations",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="club-info/partners" 
        options={{ 
          title: "Partners & Sponsors",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="videos/watch/[id]" 
        options={{ 
          title: "Video",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="calendar/event/[id]" 
        options={{ 
          title: "Event Details",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="training/plan/[id]" 
        options={{ 
          title: "Training Plan",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="profile/edit" 
        options={{ 
          title: "Edit Profile",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="profile/progress/add" 
        options={{ 
          title: "Add Progress Entry",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="profile/progress/[id]" 
        options={{ 
          title: "Progress Details",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="notifications" 
        options={{ 
          title: "Notifications",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
    </Stack>
  );
}