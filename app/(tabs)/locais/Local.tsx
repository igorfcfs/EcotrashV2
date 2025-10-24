import { useTheme } from '@/contexts/ThemeContext';
import { LocaisStackParamList } from '@/LocaisNavigation';
import { getGeneralStyles } from '@/styles/general';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../../../api';
import { auth } from '../../../firebaseConfig';

type Props = NativeStackScreenProps<LocaisStackParamList, 'Local'>;

type LocalType = {
  id: string;
  nome: string;
  endereco: string;
  imagem: string;
  telefone: string;
  site: string;
  coordenadas: { _latitude: number; _longitude: number };
  distancia: number | null;
  qtdReciclada: number;
  qtdUserReciclada: number;
};

export default function Local({ navigation, route }: Props) {
  const { localId } = route.params!;
  const { colors } = useTheme();
  const general = getGeneralStyles(colors);

  const [local, setLocal] = useState<LocalType>({
    id: localId,
    nome: '',
    endereco: '',
    imagem: '',
    telefone: '',
    site: '',
    coordenadas: { _latitude: 0, _longitude: 0 },
    distancia: null,
    qtdReciclada: 0,
    qtdUserReciclada: 0,
  });

  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingDistancia, setLoadingDistancia] = useState(true);
  const [loadingRelatorios, setLoadingRelatorios] = useState(true);

  // 1) Buscar info básica
  useEffect(() => {
    const fetchLocalInfo = async () => {
      try {
        const res = await axios.get(`${API_URL}/locais/${localId}`);
        setLocal(prev => ({
          ...prev,
          nome: res.data.nome,
          endereco: res.data.endereco,
          imagem: res.data.imagem,
          telefone: res.data.telefone,
          site: res.data.site,
          coordenadas: res.data.coordenadas,
        }));
        navigation.setOptions({ title: res.data.nome });
      } catch (error) {
        console.error("Erro ao buscar info do local:", error);
      } finally {
        setLoadingInfo(false);
      }
    };
    fetchLocalInfo();
  }, [localId]);

  useEffect(() => {
    if (local.coordenadas._latitude && local.coordenadas._longitude) {
      // console.log("Coordenadas atualizadas:", local.coordenadas);
    }
  }, [local.coordenadas]);

  // 2) Buscar distância
  useEffect(() => {
    const fetchDistancia = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const location = await Location.getCurrentPositionAsync({});
        const distanciaRes = await axios.get(
          `${API_URL}/locais/distancia_local/${localId}?lat=${location.coords.latitude}&lng=${location.coords.longitude}`
        );

        setLocal(prev => ({ ...prev, distancia: distanciaRes.data.distancia }));
      } catch (error) {
        console.error("Erro ao calcular distância:", error);
      } finally {
        setLoadingDistancia(false);
      }
    };
    fetchDistancia();
  }, [localId]);

  // 3) Buscar relatórios
  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        const userId = auth.currentUser!.uid;
        const resLocal = await axios.get(`${API_URL}/relatorio/lixo-reciclado/${localId}`);
        const resUserLocal = await axios.get(`${API_URL}/relatorio/lixo-reciclado/${userId}/${localId}`);

        setLocal(prev => ({
          ...prev,
          qtdReciclada: resLocal.data.massa ?? 0,
          qtdUserReciclada: resUserLocal.data.massa ?? 0,
        }));
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
      } finally {
        setLoadingRelatorios(false);
      }
    };
    fetchRelatorios();
  }, [localId]);

  const distanciaFormatada = local.distancia !== null
    ? local.distancia < 1000
      ? `${Math.round(local.distancia)} m`
      : `${(local.distancia / 1000).toFixed(2)} km`
    : 'Calculando...';

  const porcentagem = local.qtdReciclada > 0 
    ? ((local.qtdUserReciclada * 100) / local.qtdReciclada).toFixed(2) + "%"
    : "0%";

  const qtdRecicladaFormatada = local.qtdReciclada > 1000 ? local.qtdReciclada / 1000 + " kg" : local.qtdReciclada + " g";
  const qtdUserRecicladaFormatada = local.qtdUserReciclada > 1000 ? local.qtdUserReciclada / 1000 + " kg" : local.qtdUserReciclada + " g";

  const styles = StyleSheet.create({
    coverImage: {
      width: "100%",
      height: 200,
      borderRadius: 16,
      marginBottom: 20,
    },
    card: {
      backgroundColor: colors.backCard,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.branco,
      marginBottom: 8,
    },
    highlight: {
      color: colors.secundario,
      fontWeight: "bold",
    },
    address: {
      fontSize: 14,
      color: colors.branco,
      opacity: 0.8,
      marginBottom: 6,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primario,
      paddingVertical: 12,
      borderRadius: 12,
      marginTop: 16,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      marginLeft: 6,
    },
    recycledBox: {
      backgroundColor: colors.backCard,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    recycledNumber: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.secundario,
      marginVertical: 10,
    },
    footerText: {
      fontSize: 14,
      textAlign: "center",
      marginTop: 10,
      color: colors.branco,
      opacity: 0.8,
    },
  });

  return (
    <ScrollView style={general.container3} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Imagem de capa */}
      {loadingInfo ? (
        <ActivityIndicator color={colors.primario} size="large" style={{ marginVertical: 40 }} />
      ) : (
        <Image source={{ uri: local.imagem }} style={styles.coverImage} />
      )}

      {/* Card 1 - Ponto de coleta */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Você está a{" "}
          {loadingDistancia ? (
            <ActivityIndicator color={colors.secundario} />
          ) : (
            <Text style={styles.highlight}>{distanciaFormatada}</Text>
          )} desse ponto de coleta.
        </Text>

        <Text style={styles.sectionTitle}>{local.nome}</Text>
        <Text style={styles.address}>{local.endereco}</Text>
        {!loadingDistancia && <Text style={styles.address}>{distanciaFormatada}</Text>}

        <TouchableOpacity
  style={styles.button}
  onPress={() => {
    DeviceEventEmitter.emit('GO_TO_LOCAL', {
      latitude: local.coordenadas._latitude,
      longitude: local.coordenadas._longitude,
    });
    navigation.goBack(); // volta para o mapa
  }}
>
  <Ionicons name="map" size={20} color="#fff" />
  <Text style={styles.buttonText}>Abrir no mapa</Text>
</TouchableOpacity>
      </View>

      {/* Card 2 - Reciclagem */}
      <View style={styles.recycledBox}>
        {loadingRelatorios ? (
          <ActivityIndicator color={colors.primario} size="large" style={{ marginVertical: 20 }} />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Reciclagem nesse local</Text>
            <Text style={styles.address}>Foram reciclados</Text>
            <Text style={styles.recycledNumber}>{qtdRecicladaFormatada}</Text>
            <Text style={styles.address}>No total</Text>

            <Text style={styles.footerText}>
              Você reciclou aqui{" "}
              <Text style={styles.highlight}>{qtdUserRecicladaFormatada}</Text>{" "}
              do e-lixo reciclado nesse local.
            </Text>
            <Text style={styles.footerText}>
              Você representa{" "}
              <Text style={styles.highlight}>{porcentagem}</Text> do e-lixo
              reciclado nesse local.
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}
