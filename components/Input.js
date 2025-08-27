import { TextInput, StyleSheet } from 'react-native';
import { colors, fonts, general, metrics  } from '../styles/index';

export default function Input({ 
    placeholder, 
    keyboardType, 
    secureTextEntry, 
    value, 
    onChangeText, 
    style,
    editable,
    autoCapitalize
}) {
    return (
        <TextInput
            placeholder={placeholder}
            style={StyleSheet.flatten([general.textInputs.input, style])} // 🔹 Permite mesclar estilos personalizados
            placeholderTextColor={colors.primario} // 🔹 Mantém a cor do placeholder no tom do app
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            autoCapitalize={autoCapitalize}
        />
    );
}

