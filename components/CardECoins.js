import { Text, StyleSheet, Image, Pressable } from 'react-native';
import { colors, metrics } from '../styles';

export default function CardECoins({ descricao, quantidade, navigation }) {
  return (
    <Pressable style={styles.card} onPress={() => console.log('Card Pressed')}>
      <Text style={styles.cardTitle}>{descricao}</Text>
      <Image source={require('../assets/ECoin.png')} style={styles.coinImage} />
      <Text style={styles.cardValue}>{quantidade}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backCard,
    width: '50%',
    height: '35%',
    padding: 15,
    borderRadius: 30,
    marginHorizontal: metrics.smallMargin,
    alignItems: 'center',
    elevation: 3, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: '-15%'
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white'
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white'
  },
  coinImage: {
    width: '40%',   // antes era 30
    height: '40%',  // antes era 30
    resizeMode: 'contain',
    marginVertical: 10,
  },
})