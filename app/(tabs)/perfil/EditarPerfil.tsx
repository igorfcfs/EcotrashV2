import { ModalError, ModalSuccess } from '@/components/CustomModal'; // 🔹 Importa modais
import Titulo from '@/components/Titulo';
import { useTheme } from '@/contexts/ThemeContext';
import { StackScreenProps } from '@/types/navigation';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { API_URL } from '../../../api';
import BotaoPrimario from '../../../components/BotaoPrimario';
import Input from '../../../components/Input';
import { auth, db, firebaseConfig } from '../../../firebaseConfig';
import ModalTrocarFoto from '@/components/ModalTrocarFoto'; // ajuste o caminho conforme sua estrutura

type Props = StackScreenProps<'EditarPerfil'>;

export default function EditarPerfil({ navigation }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('Usuário');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [massa, setMassa] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 Controle dos modais
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('error');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalTrocarFotoVisible, setModalTrocarFotoVisible] = useState(false);

  const showModal = (type: 'success' | 'error', title: string, message: string) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

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
    avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
    editButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      backgroundColor: colors.backCard,
    },
    editText: { fontWeight: 'bold', color: colors.secundario },
    campo: {
      fontSize: 20,
      marginBottom: 15,
      color: colors.titulo,
      padding: 10,
      backgroundColor: colors.backCard,
      borderRadius: 10,
      borderColor: '#414c41',
    },
  });

  // Busca ID do usuário autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Busca dados do usuário e atualiza em tempo real
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setNome(data.nome || 'Usuário');
        setSobrenome(data.sobrenome || '');
        setEmail(data.email || '');
        setTelefone(data.telefone || '');
        setCpf(data.cpf || '');
        setEndereco(data.endereco || '');
        setImageUri(data.fotoPerfil || null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Atualiza massa reciclada a cada 10s
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
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  // Permissões
  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasGalleryPermission(
        galleryStatus.status === 'granted' && cameraStatus.status === 'granted'
      );
    })();
  }, []);

  // Upload da imagem de perfil
  const uploadImageAndSaveUrl = async (uri: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const response_img = await fetch(uri);
      const blob = await response_img.blob();

      const storage = getStorage();
      const filename = `gs://${firebaseConfig.projectId}.firebasestorage.app/profile/${user.uid}/photo.jpg`;
      const imageRef = ref(storage, filename);

      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { fotoPerfil: downloadURL });

      showModal('success', 'Sucesso', 'Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('🔥 Erro ao fazer upload da imagem:', error);
      showModal('error', 'Erro', 'Não foi possível atualizar a foto de perfil.');
    }
  };

  const pickImageFromGallery = async () => {
    if (!hasGalleryPermission) {
      showModal('error', 'Permissão necessária', 'Você precisa conceder permissão para acessar a galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      if (asset.uri) {
        setImageUri(asset.uri);
        await uploadImageAndSaveUrl(asset.uri);
      }
    }
  };

  const takePhoto = async () => {
    if (!hasGalleryPermission) {
      showModal('error', 'Permissão necessária', 'Você precisa conceder permissão para usar a câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      if (asset.uri) {
        setImageUri(asset.uri);
        await uploadImageAndSaveUrl(asset.uri);
      }
    }
  };

  const changePhoto = () => {
    setModalTrocarFotoVisible(true);
  };

  const handleSalvarAlteracoes = async () => {
    if (userId) {
      try {
        await axios.put(`${API_URL}/users/${userId}`, {
          nome,
          email,
          telefone,
        });
        showModal('success', 'Sucesso', 'Alterações salvas com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        showModal('error', 'Erro', 'Não foi possível salvar as alterações.');
      }
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ImageBackground source={require('../../../assets/bannerHome.png')} style={styles.banner}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <Image source={require('../../../assets/default-avatar.png')} style={styles.avatar} />
            )}
            <TouchableOpacity style={styles.editButton} onPress={changePhoto}>
              <Text style={styles.editText}>EDITAR FOTO</Text>
            </TouchableOpacity>
          </ImageBackground>

          <View
            style={{
              marginVertical: 20,
              marginHorizontal: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Titulo text="Nome" style={{ alignSelf: 'flex-start' }} />
            <Input
              placeholder="Digite seu novo nome"
              value={nome}
              style={styles.campo}
              onChangeText={setNome}
            />

            <Titulo text="Email" style={{ alignSelf: 'flex-start' }} />
            <Input
              placeholder="Digite seu novo email"
              value={email}
              style={styles.campo}
              onChangeText={setEmail}
            />

            <Titulo text="Telefone" style={{ alignSelf: 'flex-start' }} />
            <Input
              placeholder="Digite seu novo telefone"
              value={telefone}
              style={styles.campo}
              onChangeText={setTelefone}
            />

            <BotaoPrimario
              text="SALVAR ALTERAÇÕES"
              onPress={handleSalvarAlteracoes}
              style={{ marginTop: 20 }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* 🔹 Modal dinâmico */}
      {modalType === 'error' ? (
        <ModalError
          visible={modalVisible}
          title={modalTitle}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />
      ) : (
        <ModalSuccess
          visible={modalVisible}
          title={modalTitle}
          message={modalMessage}
          onClose={() => {
            setModalVisible(false);
            navigation.goBack();
          }}
        />
      )}
      <ModalTrocarFoto
        visible={modalTrocarFotoVisible}
        onClose={() => setModalTrocarFotoVisible(false)}
        onPickGallery={async () => {
          setModalTrocarFotoVisible(false);
          await pickImageFromGallery();
        }}
        onTakePhoto={async () => {
          setModalTrocarFotoVisible(false);
          await takePhoto();
        }}
      />
    </>
  );
}
