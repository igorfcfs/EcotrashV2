import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import BotaoPrimario from '../components/BotaoPrimario';
import Input from '../components/Input';
import { colors, general } from '../styles/index';

export default function Perfil({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('Usuário');
  const [endereco, setEndereco] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  const uploadImageAndSaveUrl = async (uri) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const response_img = await fetch(uri); // baixa a imagem
      const blob = await response_img.blob(); // converte para blob

      const storage = getStorage();
      const filename = `gs://ecotrash-v2.firebasestorage.app/profile/${user.uid}/photo.jpg`;
      const imageRef = ref(storage, filename);

      await uploadBytes(imageRef, blob); // faz upload do blob pro Firebase
      const downloadURL = await getDownloadURL(imageRef); // pega a URL pública

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { fotoPerfil: downloadURL });

      Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('🔥 Erro ao fazer upload da imagem:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
    }
  };

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasGalleryPermission(
        galleryStatus.status === 'granted' && cameraStatus.status === 'granted'
      );
    })();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setNome(data.nome || 'Usuário');
        setEmail(data.email || '');
        setEndereco(data.telefone || '');
        setImageUri(data.fotoPerfil || null);
      }
    });

    return () => unsubscribe();
  }, []);

  const pickImageFromGallery = async () => {
    if (!hasGalleryPermission) {
      Alert.alert('Permissão necessária', 'Você precisa conceder permissão para acessar a galeria.');
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
        console.log(asset.uri);
        setImageUri(asset.uri);
        await uploadImageAndSaveUrl(asset.uri);
      } else {
        console.warn('Imagem não possui URI válida:', asset);
      }
    }    
  };

  const takePhoto = async () => {
    if (!hasGalleryPermission) {
      Alert.alert('Permissão necessária', 'Você precisa conceder permissão para usar a câmera.');
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
      } else {
        console.warn('Imagem não possui URI válida:', asset);
      }
    }    
  };

  const changePhoto = () => {
    Alert.alert('Trocar foto', 'Escolha uma opção', [
      { text: 'Selecionar da galeria', onPress: pickImageFromGallery },
      { text: 'Tirar uma foto', onPress: takePhoto },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={general.container2}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.userImage} />
        ) : (
          <Image source={require('../assets/default-avatar.png')} style={styles.userImage} />
        )}
        <TouchableOpacity style={styles.editIcon} onPress={changePhoto}>
          <Text>✏️</Text>
        </TouchableOpacity>
      </View>

      <Text style={general.title}>{nome}</Text>

      <View style={general.textInputs.infoContainer}>
        <Text style={general.textInputs.label}>Email</Text>
        <Input value={email} onChangeText={setEmail} editable={false} />
        <Text style={general.textInputs.label}>Telefone</Text>
        <Input value={endereco} onChangeText={setEndereco} editable={false} />
      </View>

      <BotaoPrimario text="Log out" onPress={handleLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  settingsIcon: {
    color: '#4CAF50',
    fontSize: 26,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primario,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: colors.secundario,
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: colors.primario,
  },
});
