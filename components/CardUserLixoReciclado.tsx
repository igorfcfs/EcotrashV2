import { useTheme } from '@/contexts/ThemeContext';
import { RootStackParamList } from '@/types/navigation';
import { AntDesign } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { metrics } from '../styles';

interface CardUserLixoRecicladoProps {
  massa: number | null;
}

export default function CardUserLixoReciclado({ massa }: CardUserLixoRecicladoProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const valorFormatado = massa !== null
    ? (massa < 1000 ? massa : (massa / 1000).toFixed(2))
    : null;
  const unidade = massa !== null ? (massa < 1000 ? 'g' : 'kg') : '';

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.backCardLixoReciclado }]}
      onPress={() => navigation.navigate('Relatório')}
    >
      {massa === null ? (
        // 🔄 Exibe o ActivityIndicator enquanto carrega
        <View style={styles.loadingContainer}>
          <Text style={[styles.cardTitle, { color: colors.secundario }]}>
            Reciclados nesse local
          </Text>
          <ActivityIndicator color={colors.secundario} size="small" />
        </View>
      ) : (
        // ✅ Exibe o valor formatado quando carregado
        <>
          <Text style={[styles.cardMass, { color: colors.primario }]}>
            {valorFormatado}
            <Text style={styles.cardUnit}>{unidade}</Text>
          </Text>
          <View style={styles.textContainer}>
            <Text style={[styles.cardValue, { color: colors.secundario }]}>de e-lixo</Text>
            <Text style={[styles.cardValue, { color: colors.secundario }]}>descartado</Text>
          </View>
          <AntDesign name="right" size={24} color={colors.terciario} style={styles.icon} />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '80%',
    height: 100,
    padding: 15,
    borderRadius: 30,
    marginHorizontal: metrics.smallMargin,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardMass: {
    fontSize: 54,
    fontFamily: 'Montserrat_700Bold',
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
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  icon: {
    marginLeft: 10,
  },
});
