import { useTheme } from '@/contexts/ThemeContext';
import { StackScreenProps } from '@/types/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotaoLink from '../components/BotaoLink';
import BotaoPrimario from '../components/BotaoPrimario';
import { ModalError, ModalSuccess } from '../components/CustomModal';
import Input from '../components/Input';
import Titulo from '../components/Titulo';
import { auth, db } from '../firebaseConfig';
import { getGeneralStyles } from '../styles/general';

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
    <>
      <SafeAreaView style={general.autenticacao.header}>
        <SafeAreaView style={{ position: 'absolute', left: 10, alignItems: 'flex-start' }}>
          <Titulo text="Bem-vindo" style={{ color: colors.neutro, marginBottom: 0 }} />
          <Titulo text="Vamos começar." style={{ color: colors.neutro }} />
          <Text style={{ color: colors.neutro }}>Faça login para continuar</Text>
        </SafeAreaView>
        <Image
          source={require('../assets/logo.png')}
          style={{
            marginLeft: 250,
            width: 120,
            height: 100,
            justifyContent: 'flex-end',
          }}
          resizeMode="contain"
        />
      </SafeAreaView>

      <View style={general.autenticacao.container}>
        {/* Botões Tabs */}
        <View style={general.autenticacao.tabContainer}>
          <TouchableOpacity
            style={general.autenticacao.activeTabLogIn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={general.autenticacao.activeTabText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={general.autenticacao.tab}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={general.autenticacao.tabText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        {/* Campos */}
        <View style={{ width: '100%', marginBottom: 20 }}>
          <Titulo text="Email" style={{ alignSelf: 'flex-start', fontSize: 20, marginBottom: 3 }} />
          <Input
            placeholder="Insira seu email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Titulo text="Senha" style={{ alignSelf: 'flex-start', fontSize: 20, marginBottom: 3 }} />
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
        </View>

        {/* Botões */}
        <View style={{ width: '98%', alignItems: 'center' }}>
          <BotaoPrimario text="ENTRAR" onPress={signIn} />
          <BotaoLink
            text="Esqueci a senha"
            onPress={() => navigation.navigate('RecuperarSenha')}
          />
        </View>
      </View>

      {/* Modal de erro */}
      <ModalError
        visible={modalVisible && modalType === 'error'}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />

      {/* Modal de sucesso */}
      <ModalSuccess
        visible={modalVisible && modalType === 'success'}
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
    </>
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
