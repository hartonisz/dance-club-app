import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

interface AvatarProps {
  source?: { uri: string } | string;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  style,
  textStyle,
}) => {
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };
  
  const getSize = (size: AvatarSize): number => {
    if (typeof size === 'number') return size;
    return sizeMap[size] || sizeMap.md;
  };
  
  const sizeValue = getSize(size);
  
  const containerStyle: ViewStyle = {
    width: sizeValue,
    height: sizeValue,
    borderRadius: sizeValue / 2,
  };
  
  const getFontSize = (size: AvatarSize): number => {
    if (typeof size === 'number') return size * 0.4;
    
    const fontSizeMap = {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 18,
      xl: 24,
    };
    
    return fontSizeMap[size] || fontSizeMap.md;
  };
  
  const textSizeStyle: TextStyle = {
    fontSize: getFontSize(size),
  };
  
  // Handle different source formats
  const getImageSource = () => {
    if (!source) return undefined;
    if (typeof source === 'string') return { uri: source };
    return source;
  };
  
  return (
    <View style={[styles.container, containerStyle, style]}>
      {source ? (
        <Image
          source={getImageSource()}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <Text style={[styles.initials, textSizeStyle, textStyle]}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: colors.white,
    fontWeight: '600',
  },
});