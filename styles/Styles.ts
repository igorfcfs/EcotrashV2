import { StyleSheet } from 'react-native';
import general from './general';

/*
Padrão CSS: snake-case
Padrão CSS-IN-JS: camelCase
*/

export default StyleSheet.create({
  texto: {
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: 'red',
    padding: 10,
    marginBottom: 20,
  },
  ...general,
});
