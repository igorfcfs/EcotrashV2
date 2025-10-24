// src/hooks/useThemeColor.ts
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/styles/colors';

export function useThemeColor(
  props: { light?: string; dark?: string } = {},
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { theme, colors } = useTheme(); // pega o tema atual e cores do contexto

  // Prioriza cores passadas via props
  const colorFromProps = props[theme];
  if (colorFromProps) return colorFromProps;

  // Caso contrário, usa a cor do tema atual
  return colors[colorName];
}
