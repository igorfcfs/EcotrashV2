import { useTheme } from '@/contexts/ThemeContext';
import { StackScreenProps } from '@/types/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../api';

interface LocalComDistancia {
  id: string;
  nome: string;
  distancia: number;
  // Adicione outras propriedades se existirem, como 'endereco', etc.
}

type Props = StackScreenProps<'Local'>;

interface CardLocaisProps {
  localId: string;
  nome: string;
  endereco: string;
  latitude?: number;
  longitude?: number;
  onPress: Props
}

const CardLocais = ({ localId, nome, endereco, latitude, longitude, onPress }: CardLocaisProps) => {
  const { colors } = useTheme(); // ✅ cores do tema atual

  const [distanciaLocal, setDistanciaLocal] = useState<number | null>(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Faz a chamada à API
        const resDistanciaLocais = await axios.get<LocalComDistancia[]>(`${API_URL}/locais/distancia_locais?lat=${latitude}&lng=${longitude}`);
        
        // Procura o local com o ID exato
        const localEncontrado = resDistanciaLocais.data.find((local: LocalComDistancia) => local.id === localId);

        if (localEncontrado) {
          // Se o local for encontrado, atualiza o estado com a distância
          setDistanciaLocal(localEncontrado.distancia);
        } else {
          console.log("Nenhum local com o ID correspondente foi encontrado.");
          setDistanciaLocal(null); // Opcional: Limpa o estado se o local não for encontrado
        }

      } catch (error) {
        console.error('Erro ao buscar distância dos locais:', error);
        setDistanciaLocal(null); // Em caso de erro, limpa o estado
      }
    };

    fetchDados();
  }, [localId]);

  // Lógica para formatar a distância
  const distanciaFormatada = distanciaLocal !== null
    ? distanciaLocal < 1000
      ? `${Math.round(distanciaLocal)} m`
      : `${(distanciaLocal / 1000).toFixed(2)} km`
    : 'Calculando...';

  return (
    <TouchableOpacity style={[styles.card]} onPress={onPress}>
      <Image
        source={require('../assets/ponteiro-local.png')}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={[styles.nome, { color: colors.branco }]}>{nome}</Text>
        <Text style={[styles.endereco, { color: colors.branco }]} numberOfLines={2} ellipsizeMode='tail'>{endereco}</Text>
      </View>
      <Text style={[styles.lixoRecicladoUsuario, { color: colors.branco }]}>{distanciaFormatada}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  endereco: {
    fontSize: 16,
    marginVertical: 4,
  },
  lixoReciclado: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lixoRecicladoUsuario: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default CardLocais;
