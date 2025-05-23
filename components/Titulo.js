import { Text, StyleSheet } from 'react-native';
import { colors, general } from '../styles/index'

export default function Title({ text }) {
    return <Text style={general.title}>{text}</Text>
}
