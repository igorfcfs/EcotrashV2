import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../api';
import CardLocais from '../components/CardLocais';
import BotaoPrimario from '../components/BotaoPrimario';
import { auth } from '../firebaseConfig';
import { general } from '../styles';

export default function Ecopontos() {
  const [userId, setUserId] = useState(null);
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchLocais = async () => {
    try {
      const response = await axios.get(`${API_URL}/locais`);
      const locaisValidos = response.data.filter(local =>
        local?.coordenadas &&
        typeof local.coordenadas._latitude === 'number' &&
        typeof local.coordenadas._longitude === 'number'
      );
      setLocais(locaisValidos);
    } catch (err) {
      console.error('Erro ao buscar ecopontos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
        fetchLocais();
      } else {
        console.warn("Usuário não está logado");
        setLoading(false);
      }
    });

    return () => unsubscribe(); // limpa o listener ao desmontar
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Carregando ecopontos...</Text>
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.centered}>
        <Text>Você precisa estar logado para ver os ecopontos.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={general.title}>Ecopontos próximos</Text>
      {locais.map(local => (
        <View key={local.id} style={styles.cardContainer}>
          <CardLocais
            imageUri={local.imagem}
            localId={local.id}
            nome={local.nome}
            endereco={local.endereco}
            userId={userId}
          />
          <BotaoPrimario
            text="Ver no Mapa"
            onPress={() =>
              navigation.navigate('Mapa', {
                destinoLatitude: local.coordenadas._latitude,
                destinoLongitude: local.coordenadas._longitude,
                localId: local.id,
              })
            }
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    marginBottom: 24,
  },
});
