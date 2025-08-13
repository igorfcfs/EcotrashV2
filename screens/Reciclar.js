import { View, Text, StyleSheet } from 'react-native';
import { colors, general } from '../styles';

export default function ReciclarScreen() {
  return (
    <View style={[general.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.instructionText}>
        Vá até a lixeira mais próxima e preencha seus dados
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.principal, // Usando a cor padrão principal
    marginHorizontal: 20, // Para evitar o texto colando nas bordas da tela
  },
});
