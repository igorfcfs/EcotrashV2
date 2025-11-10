import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface PrimaryButtonProps {
  text: string;
  onPress: () => void;
}

export default function PrimaryButton({ text, onPress }: PrimaryButtonProps) {
  const { colors } = useTheme(); // pega as cores do tema atual

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: colors.negrito }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: colors.negrito }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
  },
});
