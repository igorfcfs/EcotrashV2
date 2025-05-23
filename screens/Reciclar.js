import { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { API_URL } from '../api';
import { auth } from '../firebaseConfig';
import { categorias, pontosPorCategoriaPorGrama } from '../data/Categorias';
import { colors, general } from '../styles';
import BotaoPrimario from '../components/BotaoPrimario';
import Titulo from '../components/Titulo';

export default function ReciclarScreen({ navigation }) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [etapa, setEtapa] = useState('form'); // 'form' | 'carregando' | 'sucesso'
  const [eCoins, setECoins] = useState(0);

  useLayoutEffect(() => {
    const titulos = {
      form: 'Formulário',
      carregando: 'Validando',
      sucesso: 'Parabéns',
    };
    navigation.setOptions({ title: titulos[etapa] || 'Reciclagem' });
  }, [etapa, navigation]);

  const simularVerificacaoELocalizacao = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');

    await new Promise(res => setTimeout(res, 500)); // Simula verificação da lixeira

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('Permissão de localização negada.');

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const { data } = await axios.get(`${API_URL}/locais/local_mais_proximo?lat=${latitude}&lng=-${longitude}`);
    const localDescarteId = data?.id_local;
    if (!localDescarteId) throw new Error('Não foi possível encontrar um local de descarte próximo.');

    return { uid: user.uid, localDescarteId };
  };

  const enviarReciclagem = async () => {
    try {
      const { uid, localDescarteId } = await simularVerificacaoELocalizacao();

      const massa = 100; // massa fixa
      const pontos = pontosPorCategoriaPorGrama[categoriaSelecionada] * massa;
      setECoins(pontos);

      const payload = {
        uid,
        categoria: categoriaSelecionada,
        massa,
        localDescarte: localDescarteId,
        pontos,
      };

      const response = await axios.post(`${API_URL}/eletronicos`, payload);

      if (response.status === 200 || response.status === 201) {
        setEtapa('sucesso');
      } else {
        throw new Error('Erro ao registrar eletrônico.');
      }
    } catch (err) {
      console.error('Erro:', err.message);
      Alert.alert('Erro', err.message || 'Falha na reciclagem.');
      setEtapa('form');
    }
  };

  const handleConfirmar = () => {
    if (!categoriaSelecionada) {
      Alert.alert('Aviso', 'Selecione uma categoria.');
      return;
    }

    setEtapa('carregando');

    // Após 5 segundos, envia os dados com massa = 100
    setTimeout(() => {
      enviarReciclagem();
    }, 5000);
  };

  if (etapa === 'carregando') {
    return (
      <View style={[general.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Titulo text="Por favor, aguarde" />
        <Text style={{ marginTop: 20, fontSize: 18, margin: 10 }}>
          A lixeira está processando o eletrônico...
        </Text>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={80} color={colors.secundario} />
        </View>
        <Text style={{ margin: 10, fontSize: 18 }}>
          Você será recompensado de acordo com a reciclagem!
        </Text>
      </View>
    );
  }

  if (etapa === 'sucesso') {
    return (
      <View style={[general.container, { justifyContent: 'space-between', alignItems: 'center' }]}>
        <Titulo text="Sucesso!" />
        <Text style={{ marginTop: 20, fontSize: 18 }}>Seu eletrônico foi reciclado com sucesso</Text>
        <Image
          source={require('../assets/sucesso.png')}
          style={{ width: 200, height: 200, marginTop: 10 }}
          resizeMode="cover"
        />
        <Text style={{ marginTop: 20, fontSize: 18 }}>Você ganhou + {eCoins} E-Coins</Text>
        <BotaoPrimario text="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={general.container3} keyboardShouldPersistTaps="handled">
          <Titulo text="Formulário de reciclagem" />
          <Text style={general.text}>
            Preencha o formulário abaixo para utilizar a lixeira inteligente e realizar a reciclagem do eletrônico desejado.
          </Text>

          <Text style={general.subtitle}>Selecione a Categoria</Text>
          <View style={styles.grid}>
            {categorias.map((item) => (
              <TouchableOpacity
                key={item.nome}
                style={[
                  styles.card,
                  categoriaSelecionada === item.nome && general.cards.selected
                ]}
                onPress={() => setCategoriaSelecionada(item.nome)}
              >
                <Image source={item.imagem} style={styles.imagem} />
                <Text style={styles.nomeCategoria}>{item.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {categoriaSelecionada && (
            <BotaoPrimario text="Confirmar Reciclagem" onPress={handleConfirmar} />
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    margin: 30,
    alignSelf: 'center',
    transform: [{ scale: 1 }],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
    elevation: 3,
  },
  imagem: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  nomeCategoria: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
