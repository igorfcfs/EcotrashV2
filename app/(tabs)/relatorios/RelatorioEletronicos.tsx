import { useTheme } from '@/contexts/ThemeContext';
import { getGeneralStyles } from '@/styles/general';
import { Eletronico } from '@/types/Eletronico';
import { RelatorioTabScreenProps } from '@/types/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { API_URL } from '../../../api';
import BotaoPrimario from '../../../components/BotaoPrimario';
import EletronicoCard from '../../../components/EletronicoCard';
import Titulo from '../../../components/Titulo';
import { auth } from '../../../firebaseConfig';
import { ModalInfo } from '../../../components/CustomModal'; // 👈 seu modal pronto

type Props = RelatorioTabScreenProps<'Histórico'>;

const RelatorioScreen = ({ navigation }: Props) => {
  const [eletronicos, setEletronicos] = useState<Eletronico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnalise, setSelectedAnalise] = useState<string | null>(null);

  const { colors } = useTheme();
  const general = getGeneralStyles(colors);

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
    } catch (err: any) {
      console.error('Erro ao buscar eletrônicos:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEletronicos();
    const interval = setInterval(fetchEletronicos, 5000);
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
        <FlatList
          data={eletronicos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (item.analise_ia) {
                  setSelectedAnalise(item.analise_ia);
                  setModalVisible(true);
                }
              }}
            >
              <EletronicoCard item={item} />
            </TouchableOpacity>
          )}
        />
      )}

      {/* 👇 Usando seu modal pronto */}
      <ModalInfo
        visible={modalVisible}
        title="Análise da IA"
        message={selectedAnalise || 'Nenhuma análise disponível.'}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default RelatorioScreen;
