import Titulo from '@/components/Titulo';
import { useTheme } from '@/contexts/ThemeContext';
import { getGeneralStyles } from '@/styles/general';
import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function ReciclarScreen() {
  const { colors } = useTheme();
  const general = getGeneralStyles(colors);

  const cupons = [
    { id: '1', title: 'Cartão Presente Loja X', value: '400 / 600' },
    { id: '2', title: 'Cartão Presente Loja Y', value: '400 / 600' },
    { id: '3', title: 'Cartão Presente Loja Z', value: '400 / 600' },
  ];

  const styles = StyleSheet.create({
    banner: {
      width: '100%',
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    bannerOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    coins: {
      fontSize: 38,
      fontWeight: '800',
      color: '#fff',
      marginTop: 8,
      textShadowColor: 'rgba(0,0,0,0.4)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 20,
      marginTop: -35,
      backgroundColor: colors.backCard,
      paddingVertical: 25,
      paddingHorizontal: 20,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    action: {
      flex: 1,
      alignItems: 'center',
    },
    actionText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.titulo,
    },
    cuponsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 20,
      marginTop: 30,
    },
    verMais: {
      color: colors.secundario,
      fontWeight: '600',
      fontSize: 14,
    },
    cuponCard: {
      backgroundColor: colors.backCard,
      borderRadius: 20,
      padding: 16,
      marginRight: 16,
      width: 160,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    cuponImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginBottom: 10,
    },
    cuponTitle: {
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
      color: colors.titulo,
      marginBottom: 4,
    },
    cuponValue: {
      fontSize: 13,
      color: colors.titulo,
    },
    dicasContainer: {
      backgroundColor: colors.backCard,
      marginHorizontal: 20,
      marginTop: 25,
      padding: 20,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 4,
    },
    dicasTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.titulo,
      marginBottom: 8,
    },
    dicaTexto: {
      fontSize: 14,
      color: colors.titulo,
      lineHeight: 20,
    },
    rodape: {
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 40,
      opacity: 0.6,
    },
    rodapeTexto: {
      fontSize: 12,
      color: colors.titulo,
    },
  });

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      {/* Banner */}
      <ImageBackground
        source={require('../../assets/bannerHome.png')}
        style={styles.banner}
        resizeMode="cover"
      >
        <View style={styles.bannerOverlay} />
        <Titulo text="E-coins disponíveis" style={{ color: '#fff' }} />
        <Text style={styles.coins}>400</Text>
      </ImageBackground>

      {/* Ações */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionText}>Resgatar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionText}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionText}>Ajuda</Text>
        </TouchableOpacity>
      </View>

      {/* Cupons */}
      <View style={styles.cuponsHeader}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.titulo }}>
          Cupons disponíveis
        </Text>
        <TouchableOpacity>
          <Text style={styles.verMais}>Ver mais</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cupons}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 40 }}
        renderItem={({ item }) => (
          <View style={styles.cuponCard}>
            <Image
              source={require('../../assets/assistencia-tecnica-samsung.jpeg')}
              style={styles.cuponImage}
              resizeMode="cover"
            />
            <Text style={styles.cuponTitle}>{item.title}</Text>
            <Text style={styles.cuponValue}>{item.value}</Text>
          </View>
        )}
      />

      {/* Dicas de Reciclagem */}
      <View style={styles.dicasContainer}>
        <Text style={styles.dicasTitle}>Dicas para ganhar mais E-coins 💡</Text>
        <Text style={styles.dicaTexto}>
          • Separe corretamente seus recicláveis antes de entregar.{'\n'}
          • Verifique os pontos de coleta parceiros mais próximos.{'\n'}
          • Recicle com frequência — quanto mais reciclar, mais E-coins você ganha!{'\n'}
          • Compartilhe com amigos e incentive a comunidade.
        </Text>
      </View>

      {/* Rodapé */}
      <View style={styles.rodape}>
        <Text style={styles.rodapeTexto}>© 2025 EcoTech App — Todos os direitos reservados</Text>
      </View>
    </ScrollView>
  );
}
