import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { general } from '../styles/index';
import { auth } from '../firebaseConfig';
import Card from '../components/CardEcoTrashs';
import axios from 'axios';
import { API_URL } from '../api';

const RelatorioScreen = () => {
  const [massa, setMassa] = useState(0);
  const [pontos, setPontos] = useState(0);
  const [dadosCategoria, setDadosCategoria] = useState(null);
  const [error, setError] = useState(null);
  
  const fetchAnalytics = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const USER_URL = API_URL + '/relatorio' + '/' + user.uid;
      console.log(USER_URL);
      const response = await axios.get(USER_URL);
      const analytics = response.data;

      setMassa(analytics.massa);
      setPontos(analytics.pontos);
      setDadosCategoria(analytics.por_categoria);
      console.log(analytics)
    } catch (err){
      console.error('Erro ao buscar eletrônicos:', err);
      setError(err.message || 'Erro ao carregar dados');
    }
  }

  useEffect(() => {
    const interval = setInterval(fetchAnalytics, 5000); // Atualiza a cada 5s
    fetchAnalytics(); // Chama imediatamente
    
    return () => clearInterval(interval);
  }, []);

  const quantidade = dadosCategoria ? {
    pilhas: dadosCategoria["Pilhas"]?.massa || 0,
    baterias: dadosCategoria["Baterias"]?.massa || 0,
    celulares: dadosCategoria["Celulares"]?.massa || 0,
    computadores: dadosCategoria["Computadores"]?.massa || 0,
    outros: dadosCategoria["Outros"]?.massa || 0
  } : {};

  const porcentagem = dadosCategoria ? {
    pilhas: dadosCategoria["Pilhas"]?.porcentagem || 0,
    baterias: dadosCategoria["Baterias"]?.porcentagem || 0,
    celulares: dadosCategoria["Celulares"]?.porcentagem || 0,
    computadores: dadosCategoria["Computadores"]?.porcentagem || 0,
    outros: dadosCategoria["Outros"]?.porcentagem || 0
  } : {};


  const pontosPorCategoria = {
    Pilhas: 5,
    Baterias: 10,
    Celulares: 100,
    Computadores: 150,
    Outros: 20,
  };
  
  const relatorioCompleto = [
    { categoria: 'Pilhas', quantidade: quantidade.pilhas, porcentagem: porcentagem.pilhas },
    { categoria: 'Baterias', quantidade: quantidade.baterias, porcentagem: porcentagem.baterias },
    { categoria: 'Celulares', quantidade: quantidade.celulares, porcentagem: porcentagem.celulares },
    { categoria: 'Computadores', quantidade: quantidade.computadores, porcentagem: porcentagem.computadores },
    { categoria: 'Outros', quantidade: quantidade.outros, porcentagem: porcentagem.outros },
  ];

  const relatorio = relatorioCompleto.filter(item => item.quantidade > 0);

  return (
    <View style={general.container3}>
      <Text style={general.title}>Relatório de Reciclagem</Text>

      <View style={general.cards.container}>
        <Card descricao="Pontos Acumulados" quantidade={pontos} />
        <Card descricao="Matéria-Prima Reciclada" quantidade={`${massa} g`} />
      </View>
      
      {dadosCategoria !== 0 ? (
        <FlatList
          data={relatorio}
          keyExtractor={(item) => item.categoria}
          renderItem={({ item }) => (
            <View style={general.cards.containerColumn}>
              <Text style={general.cards.cardTitle}>{item.categoria}</Text>
              <Text style={general.cards.cardValue}>{item.quantidade} g</Text>
              <Text style={general.cards.percentage}>
                {typeof item.porcentagem === 'number' 
                  ? `${Number(item.porcentagem.toFixed(2))}% do total` 
                  : item.porcentagem}
              </Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.card}>
          <View style={styles.info}>
            <Text style={styles.tipo}>Nenhum eletrônico reciclado ainda</Text>
            <Text style={styles.marcaModelo}>
              Quando você reciclar, os dados aparecerão aqui 😄
            </Text>
          </View>
        </View>
      )}

    </View>
  );
};

export default RelatorioScreen;

