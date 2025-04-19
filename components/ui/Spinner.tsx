import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

type SpinnerSize = 'small' | 'large';
type SpinnerColor = 'primary' | 'secondary' | 'white';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  style?: ViewStyle;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'small',
  color = 'primary',
  style,
}) => {
  const getColor = () => {
    switch (color) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'white':
        return colors.white;
      default:
        return colors.primary;
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={getColor()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});