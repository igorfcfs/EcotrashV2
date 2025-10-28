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
  const [pontosAcumulados, setPontosAcumulados] = useState<number | null>(null);
  const [massa, setMassa] = useState<number | null>(null);
  const [userId, setUserId] = useState('');
  const [localId, setLocalId] = useState(null);
  const [qtdLixo, setQtdLixo] = useState(null);
  const [qtdUserLixo, setQtdUserLixo] = useState(null);
  const [nomeLocal, setNomeLocal] = useState(null);
  const [nome, setNome] = useState('');
  const [loadingNome, setLoadingNome] = useState(true);

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

  // 🔹 Busca dados do usuário logado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        fetchLocalMaisProximo();
      } else {
        console.warn("Usuário não está logado");
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Ouve dados do usuário (nome)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setNome(data.nome || 'Usuário');
      }
      setLoadingNome(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Busca local mais próximo
  const fetchLocalMaisProximo = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const localInfo = await axios.get(
        `${API_URL}/locais/local_mais_proximo?lat=${userCoords.latitude}&lng=${userCoords.longitude}`
      );
      setLocalId(localInfo.data.id_local);
      setNomeLocal(localInfo.data.nome_local);
    } catch (error) {
      console.error('Erro ao buscar local mais próximo:', error);
    }
  };

  // 🔹 Busca relatório do local e do usuário
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

    fetchDados();
    const interval = setInterval(fetchDados, 10000);
    return () => clearInterval(interval);
  }, [localId, userId]);

  // 🔹 Atualiza pontos e massa
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
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView>
      {/* 🔸 Banner de boas-vindas */}
      <ImageBackground source={require('../../assets/bannerHome.png')} style={styles.banner}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ justifyContent: 'center', marginHorizontal: 10 }}>
            <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              Bem-vindo,{' '}
              {loadingNome ? (
                <ActivityIndicator
                  size="small"
                  color={colors.secundario}
                  style={{ transform: [{ scale: 0.9 }], marginBottom: -3 }}
                />
              ) : (
                nome.split(' ')[0]
              )}
            </Text>
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
        {/* 🔸 Meus E-Coins */}
        <CardECoins
          descricao="Meus E-Coins"
          quantidade={
            pontosAcumulados === null ? (
              <ActivityIndicator size="small" color={colors.secundario} />
            ) : (
              pontosAcumulados
            )
          }
        />

        {/* 🔸 Local mais próximo */}
        {nomeLocal ? (
          <View style={styles.container}>
            <Titulo style={{ textAlign: 'left' }}>
              Você está próximo à <Text style={{ color: colors.negrito }}>{nomeLocal}</Text>
            </Titulo>

            <View style={styles.qtdReciclado}>
              <Text style={styles.cardTitle}>Reciclados nesse local</Text>
              <Text style={styles.cardValue}>{formatarPeso(qtdLixo)}</Text>
            </View>

            <View style={styles.qtdReciclado}>
              <Text style={styles.cardTitle}>Você reciclou nesse local</Text>
              <Text style={styles.cardValue}>{formatarPeso(qtdUserLixo)}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <Titulo style={{ textAlign: 'left' }}>
              Você está próximo à <ActivityIndicator color={colors.secundario} />
            </Titulo>

            <View style={styles.qtdReciclado}>
              <Text style={styles.cardTitle}>Reciclados nesse local</Text>
              <ActivityIndicator color={colors.secundario} />
            </View>

            <View style={styles.qtdReciclado}>
              <Text style={styles.cardTitle}>Você reciclou nesse local</Text>
              <ActivityIndicator color={colors.secundario} />
            </View>
          </View>
        )}

        {/* 🔸 Seu Impacto */}
        <View style={{ marginBottom: 30 }}>
          <Titulo text="Seu Impacto" style={{ alignSelf: 'flex-start', color: colors.negrito }} />
          <CardUserLixoReciclado massa={massa} />
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
