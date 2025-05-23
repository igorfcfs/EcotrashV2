import { useEffect, useState } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import axios from 'axios';
import EletronicoCard from '../components/EletronicoCard';
import Titulo from '../components/Titulo';
import { general } from '../styles/index';
import { auth } from '../firebaseConfig';
import BotaoPrimario from '../components/BotaoPrimario';
import { API_URL } from '../api';

const RelatorioScreen = ({ navigation }) => {
  const [eletronicos, setEletronicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const parseDate = (timestamp) => {
    if (!timestamp) return new Date(0);
    if (typeof timestamp.toDate === 'function') return timestamp.toDate();
    if (timestamp._seconds && timestamp._nanoseconds)
      return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
    if (timestamp.seconds && timestamp.nanoseconds)
      return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
    if (typeof timestamp === 'string') return new Date(timestamp);
    if (timestamp instanceof Date) return timestamp;
    return new Date(0);
  };

  const fetchEletronicos = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/eletronicos/usuario-soft/${user.uid}`);
      setEletronicos(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar eletrônicos:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/eletronicos/soft-delete/${id}`);
      fetchEletronicos();
    } catch (err) {
      console.error('Erro ao deletar eletrônico:', err);
    }
  };

  const limparHistorico = async () => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja limpar todo o histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                await axios.delete(`${API_URL}/eletronicos/soft-delete/limpar/${user.uid}`);
                fetchEletronicos();
              }
            } catch (err) {
              console.error('Erro ao limpar histórico:', err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const interval = setInterval(fetchEletronicos, 5000);
    fetchEletronicos();
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={[general.container3, { justifyContent: 'center', alignItems: 'center' }]}>
        <Titulo text="Relatório de Eletrônicos" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[general.container3, { justifyContent: 'center', alignItems: 'center' }]}>
        <Titulo text="Relatório de Eletrônicos" />
        <Text style={{ color: 'red', marginBottom: 20 }}>Erro: {error}</Text>
        <BotaoPrimario text="Tentar novamente" onPress={fetchEletronicos} />
      </View>
    );
  }

  return (
    <View style={general.container3}>
      <Titulo text="Relatório de Eletrônicos" />

      {eletronicos.length === 0 ? (
        <EletronicoCard vazio />
      ) : (
        <>
          <FlatList
            data={eletronicos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EletronicoCard item={item} onDelete={handleDelete} />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <BotaoPrimario text="Limpar Histórico" onPress={limparHistorico} />
        </>
      )}

      <BotaoPrimario text="+" onPress={() => navigation.navigate('Reciclar')} />
    </View>
  );
};

export default RelatorioScreen;
