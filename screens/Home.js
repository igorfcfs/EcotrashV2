import React, { useState, useEffect, use } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BotaoPrimario from '../components/BotaoPrimario';
import Titulo from '../components/Titulo';
import Card from '../components/CardEcoTrashs';
import { colors, general } from '../styles/index';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import axios from 'axios';
import { API_URL } from '../api';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const navigation = useNavigation();
  
  const [pontosAcumulados, setPontosAcumulados] = useState(0);
  const [massa, setMassa] = useState(0);
  const [userId, setUserId] = useState(null);
  const [localId, setLocalId] = useState(null);
  const [qtdLixo, setQtdLixo] = useState(null);
  const [qtdUserLixo, setQtdUserLixo] = useState(null);
  const [nomeLocal, setNomeLocal] = useState(null);
  const [nome, setNome] = useState(null);

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

        const localInfo = await axios.get(`${API_URL}/locais/local_mais_proximo?lat=${userCoords.latitude}&lng=-${userCoords.longitude}`);
        setLocalId(localInfo.data.id_local)
        setNomeLocal(localInfo.data.nome_local);
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
    <>
      <LinearGradient
        colors={[colors.primario, colors.secundario]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{justifyContent: 'center', marginRight: 10, marginLeft: 10}}>
            <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Bem vindo, {nome}</Text>
            <Text style={styles.subtitle}>Vamos reciclar juntos.</Text>
          </View>
          <Image
            source={require('../assets/flor.png')}
            style={{ width: 100, height: 100, marginTop: 10 }}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>
      <View style={general.container2}>

        <Titulo text="Minha Jornada" />

        <View style={general.cards.container}>
          <Card descricao="Pontos Acumulados" quantidade={pontosAcumulados} />
          <Card descricao="Matéria-Prima Reciclada" quantidade={`${massa} g`} />
        </View>

        {nomeLocal ?
          <>
            <Titulo text={`Você está próximo da ${nomeLocal}`} />

            <View style={general.cards.container}>
              <Card descricao="Quantidade Total de Lixo Reciclado" quantidade={`${qtdLixo ?? 0} g`} />
              <Card descricao="Quantidade que Você Reciclou" quantidade={`${qtdUserLixo ?? 0} g`} />
            </View>
          </>
          :
          <Titulo text={"Carregando dados..."} />
        }
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    padding: 50,
    borderRadius: 16,
    marginBottom: 20,
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
});