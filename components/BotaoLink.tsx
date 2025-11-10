import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native';

interface LinkButtonProps {
  text: string;
  onPress: () => void;
  textStyle?: StyleProp<TextStyle>;
}

export default function LinkButton({ text, onPress, textStyle }: LinkButtonProps) {
  const { colors } = useTheme(); // pega a cor do tema atual

  return (
    <TouchableOpacity style={styles.linkContainer} onPress={onPress}>
      <Text style={[styles.linkText, { color: colors.secundario }, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  linkContainer: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
