import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/Home';
import RelatorioNavigation from './RelatorioNavigation';
import LocalNavigation from './LocalNavigation';
import PerfilScreen from './screens/Perfil';
import { colors } from './styles';
import CustomReciclarButton from './components/CustomReciclarButton';

const Tab = createBottomTabNavigator();

export default function Rotas() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10
        },
        tabBarActiveTintColor: colors.primario, // <- Aqui define a cor do texto ativo
        tabBarInactiveTintColor: 'gray', // <- E aqui define a cor do texto inativo
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home-outline" size={24} color={focused ? colors.secundario : 'gray'} />
          ),
        }}
      />
      <Tab.Screen
        name="Relatório"
        component={RelatorioNavigation}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="clipboard-outline" size={24} color={focused ? colors.secundario : 'gray'} />
          ),
        }}
      />
      <Tab.Screen
        name="ReciclarButton"
        component={View} // Pode usar View ou um componente vazio
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: () => <CustomReciclarButton />, // 👈 Botão customizado
        }}
      />
      <Tab.Screen
        name="Locais"
        component={LocalNavigation}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="map-outline" size={24} color={focused ? colors.secundario : 'gray'} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person-outline" size={24} color={focused ? colors.secundario : 'gray'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

