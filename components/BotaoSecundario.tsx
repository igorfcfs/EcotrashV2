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
      style={[styles.button, { borderColor: colors.primario }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: colors.primario }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
  },
});
