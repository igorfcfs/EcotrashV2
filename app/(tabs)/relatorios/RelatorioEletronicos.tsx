import { useTheme } from '@/contexts/ThemeContext';
import { getGeneralStyles } from '@/styles/general';
import { Eletronico } from '@/types/Eletronico';
import { RelatorioTabScreenProps } from '@/types/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { API_URL } from '../../../api';
import BotaoPrimario from '../../../components/BotaoPrimario';
import EletronicoCard from '../../../components/EletronicoCard';
import Titulo from '../../../components/Titulo';
import { auth } from '../../../firebaseConfig';

type Props = RelatorioTabScreenProps<"Histórico">;

const RelatorioScreen = ({ navigation }: Props) => {
  const [eletronicos, setEletronicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (err: Error | any) {
      console.error('Erro ao buscar eletrônicos:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
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
          <FlatList<Eletronico>
            data={eletronicos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EletronicoCard item={item} />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </>
      )}
    </View>
  );
};

export default RelatorioScreen;
