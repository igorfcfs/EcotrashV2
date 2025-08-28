import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { auth } from "./firebaseConfig"; // Importando a autenticação
import { NavigationContainer } from '@react-navigation/native'; //CONTÊINER PARA OS MENUS QUE QUISERMOS USAR NA APLICAÇÃO
import { createStackNavigator } from '@react-navigation/stack'
import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import RelatorioNavigation from "./RelatorioNavigation";
import Mapa from "./screens/Mapa";
import Perfil from './screens/Perfil';
import EditarPerfil from './screens/EditarPerfil';
import Rotas from './Rotas';
import { onAuthStateChanged } from 'firebase/auth';
import ReciclarScreen from "./screens/Reciclar";
import { colors } from "./styles";

const Stack = createStackNavigator();

const App = () => {
  const [isConnected, setIsConnected] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      onAuthStateChanged(auth, _user => {
        setUser(_user);
      });
      if (auth) {
        console.log("✅ Firebase Auth conectado com sucesso!");
        setIsConnected(true);
      } else {
        console.log("❌ Firebase Auth não conectado!");
        setIsConnected(false);
      }
    } catch (error) {
      console.error("❌ Erro ao conectar ao Firebase Auth:", error);
      setIsConnected(false);
    }
  }, []);

  return (
    <NavigationContainer>
      {isConnected === null ? (
        <>
          <Text style={styles.text}>🔄 Verificando conexão com Firebase...</Text>
          <Text style={styles.text}>✅ Firebase Autenticação Conectada!</Text>
        </>
      ) : isConnected ?
        user ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Rotas' component={Rotas} />
            <Stack.Screen name='Reciclar' component={ReciclarScreen} options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: colors.secundario, // <- cor de fundo do header
                alignSelf: 'center'
              },
              headerTintColor: '#fff', // <- cor do texto e ícones do header
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              title: 'Formulário', // <- título da tela no header
            }} />
            <Stack.Screen name='EditarPerfil' component={EditarPerfil} options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: colors.secundario, // <- cor de fundo do header
                alignSelf: 'center'
              },
              headerTintColor: '#fff', // <- cor do texto e ícones do header
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              title: 'Editar Perfil', // <- título da tela no header
            }} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Cadastro' component={Cadastro} />
            <Stack.Screen name='Rotas' component={Rotas} />
          </Stack.Navigator>
        )
      : (
        <Text style={styles.errorText}>❌ Erro ao conectar com Firebase Auth!</Text>
      )}
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    color: "black",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});
