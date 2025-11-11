import { useTheme } from '@/contexts/ThemeContext';
import { StackScreenProps } from '@/types/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotaoLink from '../components/BotaoLink';
import BotaoPrimario from '../components/BotaoPrimario';
import BotaoSecundario from '../components/BotaoSecundario';
import { ModalError, ModalSuccess } from '../components/CustomModal';
import Input from '../components/Input';
import Titulo from '../components/Titulo';
import { auth, db } from '../firebaseConfig';
import { getGeneralStyles } from '../styles/general';
import { ScrollView } from 'react-native-gesture-handler';

type Props = StackScreenProps<'Login'>;

export default function Login({ navigation }: Props) {
  const { colors } = useTheme();
  const general = getGeneralStyles(colors);

  // Campos
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Controle de modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'error' | 'success'>('error');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Função auxiliar para exibir modal
  const showModal = (
    type: 'error' | 'success',
    title: string,
    message: string
  ) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  async function signIn() {
    if (!email || !senha) {
      showModal('error', 'Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      console.log('Usuário logado:', user.email);

      // Busca no Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log('Dados do Firestore:', userData);

        showModal('success', 'Sucesso', `Bem-vindo, ${userData.nome}!`);
      } else {
        showModal('error', 'Erro', 'Usuário autenticado, mas não encontrado no banco.');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      let errorMessage = 'Ocorreu um erro ao fazer login.';

      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'E-mail ou senha inválidos.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas falhas. Tente novamente mais tarde.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Falha na conexão. Verifique sua internet.';
          break;
        default:
          errorMessage = error.message || errorMessage;
          break;
      }

      showModal('error', 'Erro', errorMessage);
    }
  }

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <ScrollView
      scrollEnabled={keyboardOpen} // ✅ Só rola quando o teclado está aberto
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* 🔹 Banner */}
      <Image
        source={require('../assets/bannerAuth.png')}
        style={{
          width: '100%',
          marginBottom: 10,
          resizeMode: 'cover',
        }}
      />

      {/* 🔹 Container principal */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          transform: [{ translateY: -50 }],
          marginBottom: -50,
          width: Dimensions.get('window').width,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 25,
          marginTop: -25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        {/* 🔹 Campos */}
        <Titulo text="E-mail" style={{ alignSelf: 'flex-start', fontSize: 16, marginBottom: 3 }} />
        <Input
          placeholder="Insira seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Titulo text="Senha" style={{ alignSelf: 'flex-start', fontSize: 16, marginBottom: 3 }} />
        <View style={general.passwordContainer}>
          <Input
            placeholder="Insira sua senha"
            secureTextEntry={!mostrarSenha}
            value={senha}
            onChangeText={setSenha}
            style={general.passwordInput}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={general.eyeButton}
            onPress={() => setMostrarSenha(!mostrarSenha)}
            activeOpacity={0.7}
          >
            <Image
              source={
                mostrarSenha
                  ? require('../assets/icons/visible.png')
                  : require('../assets/icons/non-visible.png')
              }
              style={general.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* 🔹 Botões */}
        <View style={{ width: '98%', alignItems: 'center', marginTop: 10, marginBottom: 50 }}>
          <BotaoPrimario text="ENTRAR" onPress={signIn} />
          <BotaoLink
            text="Esqueci a senha"
            onPress={() => navigation.navigate('RecuperarSenha')}
          />
        </View>

        {/* 🔹 Botão secundário */}
        <View style={{ width: '98%', alignItems: 'center' }}>
          <BotaoSecundario
            text="Criar conta"
            onPress={() => navigation.navigate('Cadastro')}
          />
        </View>
      </View>
    </ScrollView>

    {/* 🔹 Modais */}
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
        showConfirmButton
        confirmText="Continuar"
        onConfirm={() => {
          setModalVisible(false);
          navigation.navigate('Rotas');
        }}
        onClose={() => {
          setModalVisible(false);
          navigation.navigate('Rotas');
        }}
      />
    )}
  </KeyboardAvoidingView>
);

}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
});
