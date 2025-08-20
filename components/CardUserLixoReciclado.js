import { Text, StyleSheet, View, Pressable } from 'react-native';
import { colors, metrics } from '../styles';
import { AntDesign } from '@expo/vector-icons'; // ícone de seta

export default function CardUserLixoReciclado({ massa }) {
    const valorFormatado = massa < 1000 ? massa : (massa / 1000).toFixed(0);
    const unidade = massa < 1000 ? 'g' : 'kg';

    return (
        <Pressable style={styles.card} onPress={() => console.log('Card Pressed')}>
            <Text style={styles.cardMass}>
                {valorFormatado}
                <Text style={styles.cardUnit}>{unidade}</Text>
            </Text>
            <View style={styles.textContainer}>
                <Text style={styles.cardValue}>de e-lixo</Text>
                <Text style={styles.cardValue}>descartado</Text>
            </View>
            <AntDesign name="right" size={24} color="#222F22" style={styles.icon} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.backCardLixoReciclado,
        width: '60%',
        height: 100,
        padding: 15,
        borderRadius: 30,
        marginHorizontal: metrics.smallMargin,
        alignItems: 'center',
        elevation: 3, // Android
        shadowColor: '#000', // iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    cardMass: {
        fontSize: 54,
        fontFamily: 'Montserrat_700Bold',
        color: '#222F22',
    },
    cardUnit: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    cardValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#575b3e',
    },
    icon: {
        marginLeft: 10,
    }
});
