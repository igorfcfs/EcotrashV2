import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ícone do "X"
import { colors } from '../styles/index'

export default function EletronicoCard({ item, vazio, onDelete }) {
  const [nomeLocal, setNomeLocal] = useState('Buscando...');

  if (vazio) {
    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.tipo}>Nenhum eletrônico reciclado ainda</Text>
          <Text style={styles.marcaModelo}>
            Quando você reciclar, os dados aparecerão aqui 😄
          </Text>
        </View>
      </View>
    );
  } else {
    useEffect(() => {
      const fetchLocalNome = async () => {
        if (item?.localDescarte) {
          try {
            const docRef = doc(db, 'locations', item.localDescarte);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setNomeLocal(docSnap.data().nome || 'Sem nome');
            } else {
              setNomeLocal('Local não encontrado');
            }
          } catch (error) {
            console.error('Erro ao buscar local:', error);
            setNomeLocal('Erro ao buscar local');
          }
        } else {
          setNomeLocal('Sem local');
        }
      };

      fetchLocalNome();
    }, [item.localDescarte]);

    const parseDate = (timestamp) => {
      if (!timestamp) return null;
      if (typeof timestamp.toDate === 'function') return timestamp.toDate();
      if (timestamp._seconds && timestamp._nanoseconds)
        return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
      if (timestamp.seconds && timestamp.nanoseconds)
        return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
      if (typeof timestamp === 'string') return new Date(timestamp);
      if (timestamp instanceof Date) return timestamp;
      return null;
    };

    const dateObject = parseDate(item.criadoEm);
    const dataFormatada = dateObject
      ? dateObject.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
      : 'Data desconhecida';

    return (
      <View style={styles.card}>
        {item.foto && <Image source={{ uri: item.foto }} style={styles.image} />}
        <View style={styles.info}>
          <Text style={styles.tipo}>{item.categoria}</Text>
          <View style={styles.materiais}>
            <Text style={styles.material}>Quantidade: {item.quantidade}</Text>
            <Text style={styles.material}>🗓️ Reciclado em: {dataFormatada}</Text>
            <Text style={styles.material}>📍 Local: {nomeLocal}</Text>
            <Text style={styles.material}>Pontos: {item.pontos || 0}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => onDelete?.(item.id)}>
          <Ionicons name="close-circle" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  tipo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primario,
  },
  marcaModelo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  materiais: {
    gap: 4,
  },
  material: {
    fontSize: 13,
    color: '#444',
  },
});
