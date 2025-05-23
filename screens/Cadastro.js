import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Alert
} from 'react-native';
import { auth } from '../firebaseConfig'; // Importando Firebase Authentication
import { createUserWithEmailAndPassword } from 'firebase/auth';
import BotaoPrimario from '../components/BotaoPrimario';
import BotaoSecundario from '../components/BotaoSecundario';
import Titulo from '../components/Titulo';
import Input from '../components/Input';
import { general } from '../styles/index';
import axios from 'axios';
import { API_URL } from '../api';

export default function Cadastro({ navigation }) { 
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function signUp() {
    if (!email || !senha || !nome || !sobrenome || !telefone) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    
    createUserWithEmailAndPassword(auth, email, senha)
      .then(async userCredential => {
        const user = userCredential.user;
        
        const userData = {
          uid: user.uid,
          nome: nome,
          sobrenome: sobrenome,
          telefone: telefone,
          email: email,
        }
        
        // 🔹 Envia dados do usuário
        const responseUsers = await axios.post(`${API_URL}/users`, userData);
        if (responseUsers.status !== 200 && responseUsers.status !== 201) {
          throw new Error('Erro ao salvar usuário no banco de dados');
        }

        // 🔹 Ambos os POSTs deram certo
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.navigate('Login');
      })
      .catch(error => {
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
      });  
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
        <View style={styles.row}>
          <Input placeholder="Nome" value={nome} onChangeText={setNome} style={[styles.inputHalf, {marginRight: 5}]} />
          <Input placeholder="Sobrenome" value={sobrenome} onChangeText={setSobrenome} style={[styles.inputHalf, {marginLeft: 5}]} />
        </View>
        <View style={styles.row}>
          <Image source={require('../assets/brazil-flag.png')} style={styles.flag} />
          <Input placeholder="Telefone Ex: (DDD) 123456789"  keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} style={[styles.inputWithIcon]} />
        </View>
        <Input placeholder="Insira seu email" keyboardType="email-address" secureTextEntry={false} value={email} onChangeText={setEmail} />
        <Input placeholder="Insira sua senha" secureTextEntry={true} value={senha} onChangeText={setSenha} />
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
  },
});
