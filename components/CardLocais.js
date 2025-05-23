import { View, Text, Image, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import { colors } from '../styles';

const CardLocais = ({ imageUri, localId, nome, endereco, userId }) => {
  const [qtdLixo, setQtdLixo] = useState(null); // total do local
  const [qtdUserLixo, setQtdUserLixo] = useState(null); // total do usuário naquele local

  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Quantidade total de lixo reciclado no local
        const resLocal = await axios.get(`${API_URL}/relatorio/lixo-reciclado/${localId}`);
        setQtdLixo(resLocal.data.massa);

        // Quantidade reciclada pelo usuário naquele local
        if (userId) {
          const resUser = await axios.get(`${API_URL}/relatorio/lixo-reciclado/${userId}/${localId}`);
          setQtdUserLixo(resUser.data.massa);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do lixo reciclado:', error);
      }
    };

    fetchDados();
  }, [localId, userId]);

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUri }} resizeMode='cover' style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.endereco}>{endereco}</Text>
        <Text style={styles.lixoReciclado}>Total reciclado no local: {qtdLixo ?? '...'} g</Text>
        {userId && (
          <Text style={styles.lixoRecicladoUsuario}>
            Você reciclou aqui: {qtdUserLixo ?? '...'} g
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20, // use isso no lugar do marginRight
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primario
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 8,
  },

  textContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primario
  },
  endereco: {
    fontSize: 16,
    color: colors.secundario,
    marginVertical: 4,
  },
  lixoReciclado: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primario
  },
  lixoRecicladoUsuario: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primario
  }
});

export default CardLocais;