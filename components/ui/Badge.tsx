import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const getBadgeStyles = (): ViewStyle => {
    const baseStyle = styles.badge;
    const sizeStyle = styles[`badge_${size}`];
    const variantStyle = styles[`badge_${variant}`];
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      ...style,
    };
  };
  
  const getTextStyles = (): TextStyle => {
    const baseStyle = styles.text;
    const sizeStyle = styles[`text_${size}`];
    const variantStyle = styles[`text_${variant}`];
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      ...textStyle,
    };
  };
  
  return (
    <View style={getBadgeStyles()}>
      <Text style={getTextStyles()} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badge_sm: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  badge_md: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badge_lg: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  badge_default: {
    backgroundColor: colors.border,
  },
  badge_primary: {
    backgroundColor: colors.primary,
  },
  badge_secondary: {
    backgroundColor: colors.secondary,
  },
  badge_success: {
    backgroundColor: colors.success,
  },
  badge_warning: {
    backgroundColor: colors.warning,
  },
  badge_error: {
    backgroundColor: colors.error,
  },
  badge_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  
  text: {
    fontWeight: '500',
  },
  text_sm: {
    fontSize: 10,
  },
  text_md: {
    fontSize: 12,
  },
  text_lg: {
    fontSize: 14,
  },
  text_default: {
    color: colors.text,
  },
  text_primary: {
    color: colors.white,
  },
  text_secondary: {
    color: colors.white,
  },
  text_success: {
    color: colors.white,
  },
  text_warning: {
    color: colors.white,
  },
  text_error: {
    color: colors.white,
  },
  text_outline: {
    color: colors.primary,
  },
});