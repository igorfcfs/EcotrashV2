import { useTheme } from '@/contexts/ThemeContext';
import { getGeneralStyles } from '@/styles/general';
import axios from 'axios';
import * as Location from 'expo-location';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { API_URL } from '../../api';
import CardECoins from '../../components/CardECoins';
import CardUserLixoReciclado from '../../components/CardUserLixoReciclado';
import Titulo from '../../components/Titulo';
import { auth, db } from '../../firebaseConfig';
import formatarPeso from '../../utils/formatarPeso';

const HomeScreen = () => {
  
  const [pontosAcumulados, setPontosAcumulados] = useState(0);
  const [massa, setMassa] = useState(0);
  const [userId, setUserId] = useState('');
  const [localId, setLocalId] = useState(null);
  const [qtdLixo, setQtdLixo] = useState(null);
  const [qtdUserLixo, setQtdUserLixo] = useState(null);
  const [nomeLocal, setNomeLocal] = useState(null);
  const [nome, setNome] = useState('Usuário');
  
  const { colors } = useTheme();
  const general = getGeneralStyles(colors);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backCard,
      borderRadius: 16,
      padding: 20,
      marginVertical: 50,
    },
    qtdReciclado: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    banner: {
      width: '100%',
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      padding: 50,
      borderRadius: 16,
      marginTop: 30,
      backgroundColor: colors.background
    },
    welcomeText: {
      fontSize: 22,
      color: '#fff',
      fontWeight: '600',
    },
    subtitle: {
      fontSize: 18,
      color: '#F0F0F0',
      marginTop: 10,
    },
    cardTitle: {
      fontSize: 16,
      color: colors.branco,
      fontWeight: 'bold',
    },
    cardValue: {
      fontSize: 16,
      color: colors.negrito,
      fontWeight: 'bold',
    },
  });

  // Busca dados do usuário logado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        fetchLocalMaisProximo(); // Busca o local mais próximo
      } else {
        console.warn("Usuário não está logado");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setNome(data.nome || 'Usuário');
      }
    });

    return () => unsubscribe();
  }, []);

  // Busca local mais próximo do usuário
  const fetchLocalMaisProximo = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const localInfo = await axios.get(`${API_URL}/locais/local_mais_proximo?lat=${userCoords.latitude}&lng=${userCoords.longitude}`);
      setLocalId(localInfo.data.id_local);
      setNomeLocal(localInfo.data.nome_local);

      console.log(userCoords.latitude, userCoords.longitude)
    } catch (error) {
      console.error('Erro ao buscar local mais próximo:', error);
    }
  };

  // Busca relatório do local e do usuário
  useEffect(() => {
    if (!localId || !userId) return;

    const fetchDados = async () => {
      try {
        const resLocal = await axios.get(`${API_URL}/relatorio/lixo-reciclado/${localId}`);
        setQtdLixo(resLocal.data.massa);

        const resUser = await axios.get(`${API_URL}/relatorio/lixo-reciclado/${userId}/${localId}`);
        setQtdUserLixo(resUser.data.massa);
      } catch (error) {
        console.error('Erro ao buscar dados do lixo reciclado:', error);
      }
    };

    fetchDados(); // primeira chamada
    const interval = setInterval(fetchDados, 10000); // a cada 10 segundos

    return () => clearInterval(interval); // limpa o intervalo ao desmontar
  }, [localId, userId]);


  // Atualiza pontos e eletrônicos a cada 60s
  useEffect(() => {
    const fetchAnalytics = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const USER_URL = `${API_URL}/relatorio/${user.uid}`;
        const response = await axios.get(USER_URL);
        const analytics = response.data;

        setPontosAcumulados(analytics.pontos);
        setMassa(analytics.massa);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000); // Atualiza a cada 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView>
      <ImageBackground source={require('../../assets/bannerHome.png')} style={styles.banner}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ justifyContent: 'center', marginRight: 10, marginLeft: 10 }}>
            <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Bem vindo, {nome.split(' ')[0]}</Text>
            <Text style={styles.subtitle}>Vamos reciclar juntos.</Text>
          </View>
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 100, height: 110 }}
            resizeMode="cover"
          />
        </View>
      </ImageBackground>

      <View style={general.container2}>
        <CardECoins descricao="Meus E-Coins" quantidade={pontosAcumulados} />

        {nomeLocal ?
          <View style={styles.container}>
            <Titulo style={{ textAlign: 'left' }}>
              Você está próximo à <Text style={{ color: colors.negrito }}>{nomeLocal}</Text>
            </Titulo>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Text style={styles.cardTitle}>Reciclados nesse local</Text>
              <Text style={styles.cardValue}>{formatarPeso(qtdLixo)}</Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Text style={styles.cardTitle}>Você reciclou nesse local</Text>
              <Text style={styles.cardValue}>{formatarPeso(qtdUserLixo)}</Text>
            </View>
          </View>
          :
          <View style={styles.container}>
            <Titulo style={{ textAlign: 'left' }}>
              Você está próximo à <ActivityIndicator />
            </Titulo>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Text style={styles.cardTitle}>Reciclados nesse local</Text>
              <ActivityIndicator />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Text style={styles.cardTitle}>Você reciclou nesse local</Text>
              <ActivityIndicator />
            </View>
          </View>
        }

        <View>
          <Titulo text="Seu Impacto" style={{ alignSelf: 'flex-start', color: colors.negrito, marginRight: 100 }} />
          <CardUserLixoReciclado massa={massa} />
        </View>
      </View>

    </ScrollView>
  );
};

export default HomeScreen;
