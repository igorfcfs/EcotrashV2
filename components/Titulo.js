import { Text } from 'react-native';
import { general } from '../styles';

export default function Titulo({ text, children, style }) {
  return (
    <Text style={[general.title, style]}>
      {text ?? children}
    </Text>
  );
}
