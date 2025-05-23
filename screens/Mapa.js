import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Linking, Alert, ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Modalize } from 'react-native-modalize';
import axios from 'axios';
import CardLocais from '../components/CardLocais';
import BotaoPrimario from '../components/BotaoPrimario';
import { API_URL } from '../api';
import { useRoute, useFocusEffect } from '@react-navigation/native';

export default function Mapa() {
  const [userLocation, setUserLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [selectedLocais, setSelectedLocais] = useState(null);
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const modalizeRef = useRef(null);
  const mapRef = useRef(null);

  const route = useRoute();
  const { destinoLatitude, destinoLongitude } = route.params || {};

  const fetchLocais = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/locais`);

      const locaisValidos = (response.data || []).filter(local =>
        local?.coordenadas &&
        typeof local.coordenadas._latitude === 'number' &&
        typeof local.coordenadas._longitude === 'number'
      );

      setLocais(locaisValidos);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar locais:', err);
      setError('Erro ao carregar pontos de coleta');
    } finally {
      setLoading(false);
    }
  };

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

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        setUserLocation(location.coords);

        await fetchLocais();
      } catch (err) {
        console.error('Erro na inicialização:', err);
        setError('Erro ao carregar o mapa');
      } finally {
        setLoading(false);
      }
    };

    initialize();

    const interval = setInterval(fetchLocais, 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Sempre que a tela for focada, centraliza o mapa
  useFocusEffect(
    useCallback(() => {
      if (!mapRef.current) return;

      const latitude = typeof destinoLatitude === 'number' ? destinoLatitude : userLocation?.latitude;
      const longitude = typeof destinoLongitude === 'number' ? destinoLongitude : userLocation?.longitude;

      if (latitude && longitude) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    }, [destinoLatitude, destinoLongitude, userLocation])
  );

  const handleMarkerPress = (local) => {
    setSelectedLocais(local);
    modalizeRef.current?.open();
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchLocais();
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status === 'granted') {
          Location.getCurrentPositionAsync()
            .then(location => setUserLocation(location.coords));
        }
      });
  };

  if (!hasLocationPermission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Precisamos da sua permissão para mostrar sua localização
        </Text>
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
          latitude: userLocation?.latitude || -23.5505,
          longitude: userLocation?.longitude || -46.6333,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Você está aqui"
            pinColor="red"
            zIndex={2}
          />
        )}

        {locais.map((local) => (
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
        adjustToContentHeight={true}
        modalStyle={styles.modal}
        handlePosition="inside"
      >
        {selectedLocais && (
          <View style={styles.modalContent}>
            <CardLocais
              imageUri={selectedLocais.imagem}
              nome={selectedLocais.nome}
              endereco={selectedLocais.endereco}
              localId={selectedLocais.id}
            />
            {selectedLocais.site && (
              <BotaoPrimario
                text="Visitar Site"
                onPress={() => Linking.openURL(selectedLocais.site)}
                style={styles.siteButton}
              />
            )}
          </View>
        )}
      </Modalize>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#1B5E20',
    fontSize: 16,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  modalContent: {
    padding: 20,
    paddingBottom: 30,
  },
  siteButton: {
    backgroundColor: '#1B5E20',
  },
});
