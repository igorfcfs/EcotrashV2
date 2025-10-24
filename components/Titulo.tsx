import { useTheme } from '@/contexts/ThemeContext';
import React, { ReactNode } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { ColorsType } from '../styles/colors';
import { getGeneralStyles } from '../styles/general';

interface TituloProps {
  text?: string;
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
  colorName?: keyof ColorsType; // chave da cor do tema
}

export default function Titulo({ text, children, style, colorName = 'titulo' }: TituloProps) {
  const { colors } = useTheme(); // colors já é Colors.light ou Colors.dark

  // Pega a cor atual do tema (dark ou light)
  const color = useThemeColor({}, colorName);

  // Sempre passa colors, assim, o estilo é atualizado quando o tema muda
  const styles = getGeneralStyles(colors);

  return (
    <Text style={[styles.title, { color }, style]}>
      {text ?? children}
    </Text>
  );
}
