import { useNavigation } from '@react-navigation/native'; // 
import { Image, View, TouchableOpacity, StyleSheet } from 'react-native';

const CustomReciclarButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.reciclarButtonContainer}
      onPress={() => navigation.navigate('Reciclar')} // 👈 Chama a tela fora da Tab
    >
      <View style={styles.reciclarButton}>
        <Image
          source={require('../assets/icone-lixeira-central.png')}
          style={{ width: 90, height: 85, marginTop: 10 }}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reciclarButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reciclarButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#5D6A50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 5,
    elevation: 5,
  },
  reciclarIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 35, // Garante arredondamento da imagem também
    resizeMode: 'cover',
  },
});

export default CustomReciclarButton;