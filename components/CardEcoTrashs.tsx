import { StyleSheet, Text, View } from 'react-native';
import { metrics } from '../styles';

// 1. Tipando as props
interface CardEcoTrashProps {
  descricao: string;
  quantidade: number;
}

export default function CardEcoTrash({ descricao, quantidade }: CardEcoTrashProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{descricao}</Text>
            <Text style={styles.cardValue}>{quantidade}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#000',
        width: '50%',
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
        fontSize: 18,
        marginBottom: 10,
        color: 'white'
    },
    cardValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white'
    },
});
