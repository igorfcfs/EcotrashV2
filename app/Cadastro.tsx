import { ModalError, ModalSuccess } from '@/components/CustomModal'; // 🔹 Importa seus modais
import Titulo from '@/components/Titulo';
import { useTheme } from '@/contexts/ThemeContext';
import { getGeneralStyles } from '@/styles/general';
import { StackScreenProps } from '@/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { API_URL } from '../api';
import BotaoPrimario from '../components/BotaoPrimario';
import Input from '../components/Input';
import { auth, db } from '../firebaseConfig';

type Props = StackScreenProps<'Cadastro'>;

export default function Cadastro({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [aceitou, setAceitou] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // 🔹 Controle dos modais
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('error');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (
    type: 'success' | 'error',
    title: string,
    message: string
  ) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    const carregar = async () => {
      try {
        const valorSalvo = await AsyncStorage.getItem('@aceitou_termos');
        if (valorSalvo !== null) setAceitou(JSON.parse(valorSalvo));
      } catch (e) {
        console.log('Erro ao carregar estado:', e);
      }
    };
    carregar();
  }, []);

  const toggle = async (novoValor: any) => {
    try {
      setAceitou(novoValor);
      await AsyncStorage.setItem('@aceitou_termos', JSON.stringify(novoValor));
    } catch (e) {
      console.log('Erro ao salvar estado:', e);
    }
  };

  const { colors, theme } = useTheme();
  const general = getGeneralStyles(colors);

  async function sincronizarUIDs(oldUid: string, newUid: string) {
    const batch = writeBatch(db);
    const userDocRef = doc(db, 'users', oldUid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      const newUserDocRef = doc(db, 'users', newUid);
      batch.set(newUserDocRef, { ...data, uid: newUid });
      batch.delete(userDocRef);
    }

    const analyticsDocRef = doc(db, 'analytics', oldUid);
    const analyticsDocSnap = await getDoc(analyticsDocRef);
    if (analyticsDocSnap.exists()) {
      const data = analyticsDocSnap.data();
      const newAnalyticsDocRef = doc(db, 'analytics', newUid);
      batch.set(newAnalyticsDocRef, { ...data, uid: newUid });
      batch.delete(analyticsDocRef);
    }

    const recicladosRef = collection(db, 'recycled_eletronics');
    const recicladosQuery = query(recicladosRef, where('uid', '==', oldUid));
    const recicladosSnap = await getDocs(recicladosQuery);

    if (!recicladosSnap.empty) {
      recicladosSnap.forEach(docSnap => {
        const ref = doc(db, 'recycled_eletronics', docSnap.id);
        batch.update(ref, { uid: newUid });
      });
    }

    await batch.commit();
  }

  function validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    for (let j = 9; j < 11; j++) {
      let soma = 0;
      for (let i = 0; i < j; i++) {
        soma += parseInt(cpf.charAt(i)) * (j + 1 - i);
      }
      let resto = (soma * 10) % 11;
      if (resto === 10) resto = 0;
      if (resto !== parseInt(cpf.charAt(j))) return false;
    }

    return true;
  }

  async function signUp() {
    if (!cpf || !email || !senha || !nome || !telefone) {
      showModal('error', 'Erro', 'Preencha todos os campos!');
      return;
    }

    if (!validarCPF(cpf)) {
      showModal('error', 'Erro', 'CPF inválido!');
      return;
    }

    if (senha !== confirmarSenha) {
      showModal('error', 'Erro', 'As senhas não coincidem!');
      return;
    }

    if (!aceitou) {
      showModal('error', 'Erro', 'Você precisa aceitar os termos de uso!');
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('cpf', '==', cpf));
      const querySnapshot = await getDocs(q);

      let cadastrado = !querySnapshot.empty;
      let uidEncontrado: string = '';

      if (cadastrado) {
        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.cpf === cpf) {
            uidEncontrado = data.uid;
          }
        });
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        cpf,
        nome,
        sobrenome: '',
        telefone,
        email,
        fotoPerfil: '',
      };

      let responseUsers;
      if (cadastrado && uidEncontrado) {
        await sincronizarUIDs(uidEncontrado.trim(), user.uid);
        responseUsers = await axios.put(`${API_URL}/users/${user.uid}`, userData);
      } else {
        responseUsers = await axios.post(`${API_URL}/users`, userData);
      }

      if (responseUsers.status !== 200 && responseUsers.status !== 201) {
        throw new Error('Erro ao salvar usuário no banco de dados');
      }

      // 🔹 Modal de sucesso substituindo Alert
      showModal('success', 'Sucesso', 'Cadastro realizado com sucesso!');

    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          showModal('error', 'Erro', 'Email já está em uso!');
        } else if (error.code === 'auth/invalid-email') {
          showModal('error', 'Erro', 'Email inválido!');
        } else if (error.code === 'auth/weak-password') {
          showModal('error', 'Erro', 'A senha deve ter pelo menos 6 caracteres!');
        } else {
          showModal('error', 'Erro', 'Não foi possível realizar o cadastro.');
          console.error('Erro no cadastro:', error);
        }
      } else {
        showModal('error', 'Erro', 'Não foi possível realizar o cadastro.');
        console.error('Erro no cadastro:', error);
      }
    }
  }

  return (
    <>
      <SafeAreaView style={general.autenticacao.header}>
        <SafeAreaView style={{ position: 'absolute', left: 10, alignItems: 'flex-start', marginBottom: 20 }}>
          <Titulo text="Crie uma conta" style={{ color: colors.neutro, marginBottom: 0 }} />
          <Titulo text="para continuar" style={{ color: colors.neutro }} />
        </SafeAreaView>
        <Image
          source={require('../assets/logo.png')}
          style={{ marginLeft: 250, width: 120, height: 100, justifyContent: 'flex-end' }}
          resizeMode="contain"
        />
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={[general.autenticacao.container, { flexGrow: 1 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Tabs */}
          <View style={general.autenticacao.tabContainer}>
            <TouchableOpacity
              style={general.autenticacao.tab}
              onPress={() => navigation.goBack()}
            >
              <Text style={general.autenticacao.tabText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={general.autenticacao.activeTabCadastro}
              onPress={() => navigation.navigate('Cadastro')}
            >
              <Text style={general.autenticacao.activeTabText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>

          {/* Campos */}
          <View style={styles.form}>
            <Titulo text="Nome" style={styles.title} />
            <Input placeholder="Insira seu nome" value={nome} onChangeText={setNome} />

            <Titulo text="Telefone" style={styles.title} />
            <Input
              placeholder="Telefone Ex: (DDD) 123456789"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />

            <Titulo text="CPF" style={styles.title} />
            <Input placeholder="Insira seu CPF" keyboardType="numeric" value={cpf} onChangeText={setCpf} />

            <Titulo text="Email" style={styles.title} />
            <Input
              placeholder="Insira seu email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <Titulo text="Criar senha" style={styles.title} />
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
                  source={mostrarSenha ? require('../assets/icons/visible.png') : require('../assets/icons/non-visible.png')}
                  style={general.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={general.passwordContainer}>
              <Input
                placeholder="Confirme sua senha"
                secureTextEntry={!mostrarConfirmarSenha}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                style={general.passwordInput}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={general.eyeButton}
                onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                activeOpacity={0.7}
              >
                <Image
                  source={mostrarConfirmarSenha ? require('../assets/icons/visible.png') : require('../assets/icons/non-visible.png')}
                  style={general.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={aceitou ? 'checked' : 'unchecked'}
                onPress={() => toggle(!aceitou)}
                color={colors.secundario}
              />
              <Text style={styles.label}>
                Aceito os{' '}
                <Text
                  style={{ color: colors.primario, textDecorationLine: 'underline', fontWeight: '500' }}
                  onPress={() => navigation.navigate('TermosDeUso')}
                >
                  Termos de Uso
                </Text>
              </Text>
            </View>
          </View>

          {/* Botão Cadastrar */}
          <View style={{ width: '98%', alignItems: 'center' }}>
            <BotaoPrimario text="CADASTRAR" onPress={signUp} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
            navigation.navigate('Login');
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    marginVertical: -30,
    width: '100%'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
  },
  label: {
    fontSize: 16,
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 3
  },
});
