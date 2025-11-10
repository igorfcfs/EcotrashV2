import { useTheme } from '@/contexts/ThemeContext';
import { RootStackParamList, StackScreenProps } from '@/types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Modalize } from 'react-native-modalize';
import { API_URL } from '../../../api';
import BotaoPrimario from '../../../components/BotaoPrimario';
import CardLocais from '../../../components/CardLocais';

type LocaisRouteProp = RouteProp<RootStackParamList, 'Locais'>;
type Props = StackScreenProps<'Local'>;

interface Local {
  id: string;
  nome: string;
  endereco: string;
  imagem?: string;
  site?: string;
  coordenadas: { _latitude: number; _longitude: number };
}

export default function Mapa({ navigation }: Props) {
  const route = useRoute<LocaisRouteProp>();
  const { localId, destinoLatitude, destinoLongitude } = route.params || {};

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [selectedLocais, setSelectedLocais] = useState<Local | null>(null);
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const modalizeRef = useRef<Modalize>(null);
  const mapRef = useRef<MapView>(null);

  const { colors } = useTheme();    

  const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { ...StyleSheet.absoluteFillObject },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    loadingText: { marginTop: 10, color: '#1B5E20', fontSize: 16 },
    errorText: { color: '#d32f2f', marginBottom: 20, textAlign: 'center', fontSize: 16 },
    modal: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: colors.backCard,
      paddingTop: 8,
    },
    modalContent: {
      padding: 16,
    },
    sheetTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.branco,
      marginBottom: 12,
      alignSelf: 'center',
      paddingHorizontal: 40
    },
    emptyText: {
      fontSize: 14,
      color: '#eee',
      textAlign: 'center',
    },
  });

  const fetchLocais = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/locais`);
      const locaisValidos: Local[] = (response.data || []).filter(
        (local: any) =>
          local?.coordenadas &&
          typeof local.coordenadas._latitude === 'number' &&
          typeof local.coordenadas._longitude === 'number'
      );

      // Só ordena se a localização do usuário estiver disponível
      if (userLocation) {
        locaisValidos.sort((a, b) => {
          const distA = Math.sqrt(
            Math.pow(a.coordenadas._latitude - userLocation.latitude, 2) +
            Math.pow(a.coordenadas._longitude - userLocation.longitude, 2)
          );
          const distB = Math.sqrt(
            Math.pow(b.coordenadas._latitude - userLocation.latitude, 2) +
            Math.pow(b.coordenadas._longitude - userLocation.longitude, 2)
          );
          return distA - distB;
        });
      }

      setLocais(locaisValidos);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar locais:', err);
      setError('Erro ao carregar pontos de coleta');
    } finally {
      setLoading(false);
    }
  };

  // 1️⃣ Inicializa localização do usuário
useEffect(() => {
  const initialize = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada');
        setLoading(false);
        return;
      }
      setHasLocationPermission(true);

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setUserLocation(location.coords);
    } catch (err) {
      console.error('Erro na inicialização:', err);
      setError('Erro ao carregar o mapa');
    } finally {
      setLoading(false);
    }
  };

  initialize();
}, []);

// 2️⃣ Assim que tiver localização, carrega e ordena os locais
useEffect(() => {
  if (!userLocation) return;

  const loadLocais = async () => {
    await fetchLocais();
  };

  loadLocais();

  const interval = setInterval(fetchLocais, 3600000);
  return () => clearInterval(interval);
}, [userLocation]);

// 3️⃣ Garante que o redirecionamento para o local funcione SEMPRE
useEffect(() => {
  const subscription = DeviceEventEmitter.addListener(
    'GO_TO_LOCAL',
    ({ latitude, longitude }: { latitude: number; longitude: number }) => {
      if (!mapRef.current || !latitude || !longitude) return;
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  );

  return () => subscription.remove();
}, [userLocation]); // <--- dependência corrigida


  const handleMarkerPress = (local: Local) => {
    setSelectedLocais(local);
    modalizeRef.current?.open();
  };

  const handleRetry = async () => {
    setError(null);
    setLoading(true);
    await fetchLocais();
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync();
      setUserLocation(location.coords);
    }
  };

  if (!hasLocationPermission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Precisamos da sua permissão para mostrar sua localização</Text>
        <BotaoPrimario text="Conceder Permissão" onPress={handleRetry} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1B5E20" />
        <Text style={styles.loadingText}>Carregando mapa...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <BotaoPrimario text="Tentar Novamente" onPress={handleRetry} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude ?? -23.5505,
          longitude: userLocation?.longitude ?? -46.6333,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Você está aqui" pinColor="red" zIndex={2} />
        )}
        {locais.map(local => (
          <Marker
            key={local.id}
            coordinate={{
              latitude: local.coordenadas._latitude,
              longitude: local.coordenadas._longitude,
            }}
            title={local.nome}
            description={local.endereco}
            onPress={() => handleMarkerPress(local)}
            pinColor="green"
          />
        ))}
      </MapView>

      <Modalize 
        ref={modalizeRef}
        handleStyle={{
          backgroundColor: colors.branco,  // cor do risquinho
          width: 80,               // largura
          height: 5,               // altura
          borderRadius: 2.5,       // arredondar pontas
        }}
        modalHeight={700} // altura máxima quando puxar
        alwaysOpen={300} // altura inicial fixa (50% da tela, ajusta conforme necessário)
        handlePosition="inside"
        modalStyle={styles.modal}
        panGestureEnabled={true}
        withHandle={true}
        overlayStyle={{ backgroundColor: 'transparent' }} // deixa o fundo transparente
        >
        
        <View style={styles.modalContent}>
          <View>
            <Text style={styles.sheetTitle}>Encontre pontos de coleta perto de você</Text>
          </View>
          <ScrollView>
            {locais.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum ponto de coleta encontrado</Text>
            ) : (
              locais.map(local => (
                <CardLocais
                  key={local.id}
                  localId={local.id}
                  nome={local.nome}
                  endereco={local.endereco}
                  latitude={userLocation?.latitude}
                  longitude={userLocation?.longitude}
                  onPress={() => navigation.navigate('Local', { localId: local.id })}
                />
              ))
            )}
          </ScrollView>
        </View>
      </Modalize>
    </View>
  );
}
