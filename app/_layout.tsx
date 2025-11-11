import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { auth } from "../firebaseConfig";

// Screens
import Rotas from '../Rotas';
import EditarPerfil from './(tabs)/perfil/EditarPerfil';
import ReciclarScreen from "./(tabs)/Reciclar";
import Cadastro from './Cadastro';
import Configuracoes from './Configuracoes';
import ConfirmacaoReset from './ConfirmacaoReset';
import Login from './Login';
import RecuperarSenha from './RecuperarSenha';
import TermosDeUso from './TermosDeUso';
import Local from './(tabs)/locais/Local';
import Onboarding from './Onboarding';

// Contexto de Tema
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true); // novo estado
  const { colors } = useTheme();

  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (_user) => {
      setUser(_user);
      setLoading(false); // só libera após a verificação
    });

    if (auth) {
      console.log("✅ Firebase Auth conectado com sucesso!");
      setIsConnected(true);
    } else {
      console.log("❌ Firebase Auth não conectado!");
      setIsConnected(false);
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkFirstTime = async () => {
      const hasOpened = await AsyncStorage.getItem('@hasOpenedApp');
      setIsFirstTime(!hasOpened);
      if (!hasOpened) {
        await AsyncStorage.setItem('@hasOpenedApp', 'true');
      }
    };
    checkFirstTime();
  }, []);

  if (isFirstTime === null) return null; // loading splash

  // Exibe tela de carregamento inicial
  if (loading || isConnected === null) {
    return (
      <View style={styles.centered}>
        {/* Coloca aqui teu logo se quiser */}
        {/* <Image source={require('../assets/logo.png')} style={{ width: 120, height: 120, marginBottom: 20 }} /> */}
        <ActivityIndicator size="large" color={colors.secundario} />
        <Text style={[styles.text, { color: colors.titulo, marginTop: 10 }]}>
          Carregando dados do usuário...
        </Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.errorText, { color: colors.titulo }]}>
          ❌ Erro ao conectar com Firebase Auth!
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstTime ? (
        <>
          <Stack.Screen name='Onboarding' component={Onboarding} />
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Cadastro' component={Cadastro} />
          <Stack.Screen name='RecuperarSenha' component={RecuperarSenha} />
          <Stack.Screen name='ConfirmacaoReset' component={ConfirmacaoReset} />
          <Stack.Screen name='TermosDeUso' component={TermosDeUso} />
        </>
      ) 
      : user ? (
        <>
          <Stack.Screen name='Rotas' component={Rotas} />
          <Stack.Screen 
            name='Reciclar' 
            component={ReciclarScreen} 
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.secundario },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              title: 'Sua Carteira',
            }}
          />
          <Stack.Screen 
            name='EditarPerfil' 
            component={EditarPerfil} 
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.secundario },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              title: 'Editar Perfil',
            }}
          />
          <Stack.Screen 
            name='Configurações' 
            component={Configuracoes} 
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.secundario },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              title: 'Configurações',
            }}
          />
          <Stack.Screen 
            name='Local' 
            component={Local} 
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.secundario },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              title: 'Local',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Cadastro' component={Cadastro} />
          <Stack.Screen name='RecuperarSenha' component={RecuperarSenha} />
          <Stack.Screen name='ConfirmacaoReset' component={ConfirmacaoReset} />
          <Stack.Screen name='TermosDeUso' component={TermosDeUso} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 16, textAlign: 'center' },
  errorText: { fontSize: 18, color: 'red' },
});
