import { useTheme } from '@/contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { doc, DocumentData, getDoc, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { db } from '../firebaseConfig';

interface EletronicoItem {
  categoria: string;
  massa: number;
  criadoEm: Timestamp | string | Date;
  localDescarte?: string;
  foto?: string;
  pontos?: number;
}

interface EletronicoCardProps {
  item?: EletronicoItem;
  vazio?: boolean;
}

export default function EletronicoCard({ item, vazio }: EletronicoCardProps) {
  const { colors } = useTheme(); 
  const [nomeLocal, setNomeLocal] = useState<string>('Buscando...');

  useEffect(() => {
    if (!item?.localDescarte) {
      setNomeLocal('Sem local');
      return;
    }

    const fetchLocalNome = async () => {
      try {
        const docRef = doc(db, 'locations', item.localDescarte!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNomeLocal((docSnap.data() as DocumentData).nome || 'Sem nome');
        } else {
          setNomeLocal('Local não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar local:', error);
        setNomeLocal('Erro ao buscar local');
      }
    };

    fetchLocalNome();
  }, [item?.localDescarte]);

  const parseDate = (timestamp: Timestamp | string | Date | undefined): Date | null => {
    if (!timestamp) return null;
    if (typeof (timestamp as Timestamp)?.toDate === 'function') return (timestamp as Timestamp).toDate();
    if ((timestamp as any)?._seconds && (timestamp as any)?._nanoseconds)
      return new Date((timestamp as any)._seconds * 1000 + (timestamp as any)._nanoseconds / 1e6);
    if ((timestamp as any)?.seconds && (timestamp as any)?.nanoseconds)
      return new Date((timestamp as any).seconds * 1000 + (timestamp as any).nanoseconds / 1e6);
    if (typeof timestamp === 'string') return new Date(timestamp);
    if (timestamp instanceof Date) return timestamp;
    return null;
  };

  const dateObject = parseDate(item?.criadoEm);
  const dataFormatada = dateObject
    ? dateObject.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
    : 'Data desconhecida';

  if (vazio || !item) {
    return (
      <View style={[styles.card, { backgroundColor: colors.backCard }]}>
        <View style={styles.info}>
          <Text style={[styles.tipo, { color: colors.primario }]}>
            Nenhum eletrônico reciclado ainda
          </Text>
          <Text style={[styles.marcaModelo, { color: colors.secundario }]}>
            Quando você reciclar, os dados aparecerão aqui 😄
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.backCard }]}>
      {item.foto && <Image source={{ uri: item.foto }} style={styles.image} />}
      <View style={styles.info}>
        <Text style={[styles.tipo, { color: colors.secundario }]}>{item.categoria}</Text>
        <View style={styles.materiais}>
          {/* Quantidade */}
          <View style={styles.iconRow}>
            <Ionicons name="cube-outline" size={16} color={colors.branco} />
            <Text style={[styles.material, { color: colors.branco, marginLeft: 4 }]}>
              Quantidade: {item.massa}g
            </Text>
          </View>

          {/* Reciclado em */}
          <View style={styles.iconRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.branco} />
            <Text style={[styles.material, { color: colors.branco, marginLeft: 4 }]}>
              Reciclado em: {dataFormatada}
            </Text>
          </View>

          {/* Local */}
          <View style={styles.iconRow}>
            <Ionicons name="location-outline" size={16} color={colors.branco} />
            <Text style={[styles.material, { color: colors.branco, marginLeft: 4 }]}>
              Local: {nomeLocal}
            </Text>
          </View>

          {/* E-coins */}
          <View style={styles.pontosContainer}>
            <Image 
              source={require('../assets/ECoin.png')} 
              style={styles.coinIcon} 
            />
            <Text style={[styles.material, { color: colors.branco }]}>
              E-coins: {item.pontos || 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
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
  },
  marcaModelo: {
    fontSize: 14,
    marginBottom: 8,
  },
  materiais: {
    gap: 4,
  },
  material: {
    fontSize: 13,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pontosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
