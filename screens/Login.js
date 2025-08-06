import React, { useState } from 'react';
import { View, Alert, Image, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Importando Firebase Authentication
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import BotaoPrimario from '../components/BotaoPrimario';
import BotaoSecundario from '../components/BotaoSecundario';
import BotaoLink from '../components/BotaoLink';
import Titulo from '../components/Titulo';
import Input from '../components/Input';
import { general } from '../styles/index';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function signIn() {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
  
    signInWithEmailAndPassword(auth, email, senha)
      .then(async userCredential => {
        const user = userCredential.user;
        console.log('Usuário logado:', user.email);
  
        // 🔥 Buscando o documento do Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log('Dados do Firestore:', userData);
  
          Alert.alert("Sucesso", `Bem-vindo, ${userData.nome}!`);
          navigation.navigate('Rotas', { userData }); // Envia dados para próxima tela, se quiser
        } else {
          Alert.alert("Erro", "Usuário autenticado, mas não encontrado no banco.");
        }
      })
      .catch(error => {
        console.error("Erro no login:", error);
  
        let errorMessage = "Ocorreu um erro ao fazer login.";
        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = "E-mail ou senha inválidos.";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Muitas tentativas falhas. Tente novamente mais tarde.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Falha na conexão. Verifique sua internet.";
            break;
          default:
            errorMessage = error.message;
            break;
        }
  
        Alert.alert("Erro", errorMessage);
      });
  }

  return (
    <View style={general.container2}>
      <Image
        source={require('../assets/logo.png')}
        style={general.logo}
        resizeMode="contain"
      />

      <Titulo text="Login" />

      {/* Campos */}
      <View style={{width: '100%', marginBottom: 20}}>
        <Input placeholder="Insira seu email" keyboardType="email-address" secureTextEntry={false} value={email} onChangeText={setEmail} />
        {/* Senha com botão olho */}
        <View style={general.passwordContainer}>
          <Input
            placeholder="Insira sua senha"
            secureTextEntry={!mostrarSenha}
            value={senha}
            onChangeText={setSenha}
            style={general.passwordInput}
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

      {/*Botões*/}
      <View style={{width: '98%', alignItems: 'center'}}>
        <BotaoPrimario text="Entrar" onPress={signIn} />
        <BotaoSecundario text="Não tem uma conta? | Faça Cadastro" onPress={() => navigation.navigate('Cadastro')} />
        <BotaoLink text="Esqueci a senha" onPress={() => /*navigation.navigate('RecuperarSenha')*/ console.log('Recuperar senha em desenvolvimento')} />
      </View>
    </View>
  );
}

