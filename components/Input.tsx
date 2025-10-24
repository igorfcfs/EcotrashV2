import { useTheme } from '@/contexts/ThemeContext';
import { getGeneralStyles } from '@/styles/general';
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native';

interface InputProps {
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: StyleProp<TextStyle>;
  editable?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
}

export default function Input({
  placeholder,
  keyboardType,
  secureTextEntry,
  value,
  onChangeText,
  style,
  editable,
  autoCapitalize,
}: InputProps) {
  const { colors } = useTheme();
  const general = getGeneralStyles(colors);

  return (
    <TextInput
      placeholder={placeholder}
      style={StyleSheet.flatten([general.textInputs.input, style])}
      placeholderTextColor={colors.verdeCinza} // pega a cor do tema atual
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      autoCapitalize={autoCapitalize}
    />
  );
}

