import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import { auth, db } from '../firebaseConfig'; // Importando Firebase Authentication
import { createUserWithEmailAndPassword } from 'firebase/auth';
import BotaoPrimario from '../components/BotaoPrimario';
import BotaoSecundario from '../components/BotaoSecundario';
import Titulo from '../components/Titulo';
import Input from '../components/Input';
import { general } from '../styles/index';
import axios from 'axios';
import { API_URL } from '../api';
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';

export default function Cadastro({ navigation }) { 
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function sincronizarUIDs(oldUid, newUid) {
    console.log('🔄 Iniciando sincronização de UIDs...');
    console.log('oldUid:', oldUid);
    console.log('newUid:', newUid);

    const batch = writeBatch(db);

    // Atualizar documento com ID = oldUid em 'users'
    const userDocRef = doc(db, 'users', oldUid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      const newUserDocRef = doc(db, 'users', newUid);
      batch.set(newUserDocRef, { ...data, uid: newUid });
      batch.delete(userDocRef);
      console.log('✅ Documento em "users" atualizado e movido com sucesso.');
    } else {
      console.warn('⚠️ Documento em "users" com o UID antigo não encontrado.');
    }

    // Atualizar documento com ID = oldUid em 'analytics'
    const analyticsDocRef = doc(db, 'analytics', oldUid);
    const analyticsDocSnap = await getDoc(analyticsDocRef);

    if (analyticsDocSnap.exists()) {
      const data = analyticsDocSnap.data();
      const newAnalyticsDocRef = doc(db, 'analytics', newUid);
      batch.set(newAnalyticsDocRef, { ...data, uid: newUid });
      batch.delete(analyticsDocRef);
      console.log('✅ Documento em "analytics" atualizado e movido com sucesso.');
    } else {
      console.warn('⚠️ Documento em "analytics" com o UID antigo não encontrado.');
    }

    // Atualizar todos os documentos em 'recycled_eletronics' com campo uid = oldUid
    const recicladosRef = collection(db, 'recycled_eletronics');
    const recicladosQuery = query(recicladosRef, where('uid', '==', oldUid));
    const recicladosSnap = await getDocs(recicladosQuery);

    if (!recicladosSnap.empty) {
      recicladosSnap.forEach(docSnap => {
        const ref = doc(db, 'recycled_eletronics', docSnap.id);
        batch.update(ref, { uid: newUid });
        console.log(`♻️ Documento reciclado "${docSnap.id}" atualizado.`);
      });
    } else {
      console.warn('⚠️ Nenhum documento encontrado em "recycled_eletronics" com uid antigo.');
    }

    // Commit final
    await batch.commit();
    console.log('✅ Sincronização de UIDs concluída com sucesso.');
  }

  async function signUp() {
    if (!cpf || !email || !senha || !nome || !sobrenome || !telefone) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('cpf', '==', cpf));
      const querySnapshot = await getDocs(q);

      let cadastrado = !querySnapshot.empty;
      let uidEncontrado = null;

      if (cadastrado) {
        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.cpf === cpf) {
            uidEncontrado = data.uid; // ou doc.id
          }
        });
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        cpf,
        nome,
        sobrenome,
        telefone,
        email,
        fotoPerfil: ''
      };

      let responseUsers;
      console.log('Usuário encontrado:', cadastrado, 'UID:', uidEncontrado);

      if (cadastrado && uidEncontrado) {
        await sincronizarUIDs(uidEncontrado.trim(), user.uid);

        responseUsers = await axios.put(`${API_URL}/users/${user.uid}`, userData);
      } else {
        responseUsers = await axios.post(`${API_URL}/users`, userData);
      }

      if (responseUsers.status !== 200 && responseUsers.status !== 201) {
        throw new Error('Erro ao salvar usuário no banco de dados');
      }

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Email já está em uso!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'Email inválido!');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres!');
      } else {
        Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
        console.error('Erro no cadastro:', error);
      }
    }
  }

  return (
    <SafeAreaView style={general.container}>
      {/* Logotipo */}
      <Image
        source={require('../assets/logo.png')}
        style={general.logo}
        resizeMode="contain"
      />

      <Titulo text="Cadastro" />

      {/* Campos de Cadastro */}
      <View style={styles.form}>
        {/* Nome e Sobrenome */}
        <View style={styles.row}>
          <Input
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={[styles.inputHalf, { marginRight: 5 }]}
          />
          <Input
            placeholder="Sobrenome"
            value={sobrenome}
            onChangeText={setSobrenome}
            style={[styles.inputHalf, { marginLeft: 5 }]}
          />
        </View>

        {/* Telefone */}
        <View style={styles.row}>
          <Image
            source={require('../assets/brazil-flag.png')}
            style={styles.flag}
          />
          <Input
            placeholder="Telefone Ex: (DDD) 123456789"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
            style={styles.inputWithIcon}
          />
        </View>

        {/* CPF */}
        <Input
          placeholder="Insira seu CPF"
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
        />

        {/* Email */}
        <Input
          placeholder="Insira seu email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* Senha com botão olho */}
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
      <View style={{width: '98%', alignItems: 'center'}}>
        <BotaoPrimario text="Cadastrar-se" onPress={signUp} />
        <BotaoSecundario text="Já tem uma conta? Faça Login" onPress={() => navigation.navigate('Login')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  form: {
    marginBottom: 20,
    width: '100%'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 🔹 Garante distribuição correta dos inputs
    alignItems: 'center',
    paddingHorizontal: 5,
    width: '100%',
  },
  inputHalf: {
    flex: 1,
    paddingVertical: 12, // 🔹 Aumenta a área interna para melhor visibilidade do placeholder
    fontSize: 16,
  },
  inputWithIcon: {
    flex: 1,
    marginLeft: 5,
  },
  flag: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
    top: '50%',
    transform: [{ translateY: -40 }], // metade da altura do ícone
  }, 
});
