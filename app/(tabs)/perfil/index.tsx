import { useTheme } from '@/contexts/ThemeContext';
import { StackScreenProps } from '@/types/navigation';
import { Ionicons } from '@expo/vector-icons'; // ou 'react-native-vector-icons/Ionicons'
import axios from 'axios';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_URL } from '../../../api';
import BotaoPrimario from '../../../components/BotaoPrimario';
import CardUserLixoReciclado from '../../../components/CardUserLixoReciclado';
import Titulo from '../../../components/Titulo';
import { auth, db } from '../../../firebaseConfig';

type Props = StackScreenProps<'Perfil'>;

export default function Perfil({ navigation }: Props) {
  const [imageUri, setImageUri] = useState(null);
  const [nome, setNome] = useState('Usuário');
  const [userId, setUserId] = useState('');
  const [massa, setMassa] = useState<number | null>(null);

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    banner: {
      width: '100%',
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 0 },
    header: { alignItems: 'center', marginBottom: 20 },
    avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
    nome: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: "#fff" },
    editButton: {
      paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1,
      backgroundColor: colors.backCard
    },
    editText: { fontWeight: 'bold', color: colors.secundario },

    section: { marginBottom: 25, borderRadius: 100, padding: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: colors.branco },

    cardImpacto: {
      alignItems: 'center', padding: 20, borderWidth: 1, borderRadius: 10,
    },
    impactValue: { fontSize: 32, fontWeight: 'bold' },
    impactLabel: { fontSize: 14, marginBottom: 10 },
    link: { color: 'blue' },

    listItem: {
      paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.backCard,
      backgroundColor: colors.backCard,
      marginHorizontal: -15
    },

    listItemText: { fontSize: 14, color: colors.branco, marginHorizontal: 15 },
  });

  // Busca dados do usuário logado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.warn("Usuário não está logado");
      }
    });

    return () => unsubscribe();
  }, []);

  // Atualiza pontos e eletrônicos a cada 60s
  useEffect(() => {
    const fetchAnalytics = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const USER_URL = `${API_URL}/relatorio/${user.uid}`;
        const response = await axios.get(USER_URL);
        const analytics = response.data;

        setMassa(analytics.massa);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000); // Atualiza a cada 10s

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setNome(data.nome || 'Usuário');
        setImageUri(data.fotoPerfil || null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header - Foto + Nome + Editar */}
        <ImageBackground source={require('../../../assets/bannerHome.png')} style={styles.banner}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '30%', marginBottom: 10}}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <Image source={require('../../../assets/default-avatar.png')} style={styles.avatar} />
            )}
            {/* <BotaoPrimario text="Settings" onPress={() => navigation.navigate('Configurações')} /> */}
            <Ionicons name="settings-outline" size={40} color={'#fff'} onPress={() => navigation.navigate('Configurações')} style={{marginLeft: 70, marginBottom: 80}} />
          </View>
          <Text style={styles.nome}>{nome.split(' ')[0]}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditarPerfil')}>
            <Text style={styles.editText}>EDITAR PERFIL</Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* Impacto */}
        <View style={{backgroundColor: colors.backCard, padding: 30, marginHorizontal: -15, marginBottom: 20}}>
          <Titulo text="Meu Impacto" style={{ alignSelf: 'flex-start', color: colors.branco }} />
          <CardUserLixoReciclado massa={massa} />
        </View>

        {/* Ações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações</Text>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Locais')}>
            <Text style={styles.listItemText}>Ver pontos de coleta próximos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Reciclar')}>
            <Text style={styles.listItemText}>Ver carteira de E-coins</Text>
          </TouchableOpacity>
        </View>

        {/* Outros */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outros</Text>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Relatório')}>
            <Text style={styles.listItemText}>Histórico de reciclagem</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listItemText}>Ajuda</Text>
          </TouchableOpacity> */}
        </View>
        
        <BotaoPrimario text="Log out" style={{alignSelf: 'center'}} onPress={handleLogout} />

      </ScrollView>
    </SafeAreaView>
  );
}

