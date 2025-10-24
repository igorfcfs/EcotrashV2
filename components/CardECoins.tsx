import { useTheme } from '@/contexts/ThemeContext';
import { RootStackParamList } from '@/types/navigation';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { metrics } from '../styles';

interface CardECoinsProps {
  descricao: string;
  quantidade: number;
}

export default function CardECoins({ descricao, quantidade }: CardECoinsProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme(); // ✅ cores do tema atual

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.backCard }]}
      onPress={() => navigation.navigate('Reciclar')}
    >
      <Text style={[styles.cardTitle, { color: colors.titulo }]}>{descricao}</Text>
      <Image source={require('../assets/ECoin.png')} style={styles.coinImage} />
      <Text style={[styles.cardValue, { color: colors.titulo }]}>{quantidade}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '50%',
    height: '35%',
    padding: 15,
    borderRadius: 30,
    marginHorizontal: metrics.smallMargin,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: '-15%',
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  coinImage: {
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
    marginVertical: 10,
  },
});
