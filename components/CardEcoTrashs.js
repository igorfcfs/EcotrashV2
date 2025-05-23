import {View, Text, StyleSheet} from 'react-native';
import { colors, metrics } from '../styles';

export default function CardEcoTrash({ descricao, quantidade }) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{descricao}</Text>
            <Text style={styles.cardValue}>{quantidade}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        width: '48%',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: metrics.smallMargin,
        alignItems: 'center',
        elevation: 3, // Para Android
        shadowColor: '#000', // Para iOS
        shadowOffset: { width: 0, height: 2 }, // Para iOS
        shadowOpacity: 0.2, // Para iOS
        shadowRadius: 2, // Para iOS
    },
    cardTitle: {
        fontSize: 16,
        marginBottom: 10,
        color: colors.primario
    },
    cardValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primario
    },
})