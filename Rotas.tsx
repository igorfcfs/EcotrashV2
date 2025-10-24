import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import HomeScreen from './app/(tabs)/index';
import PerfilScreen from './app/(tabs)/perfil/index';
import CustomReciclarButton from './components/CustomReciclarButton';
import LocaisNavigation from './LocaisNavigation';
import RelatorioNavigation from './RelatorioNavigation';

import { useTheme } from '@/contexts/ThemeContext';

const Tab = createBottomTabNavigator();

export default function Rotas() {

  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: colors.tabBar, // <- Aqui define a cor de fundo da tab bar
        },
        tabBarActiveTintColor: colors.secundario, // <- Aqui define a cor do texto ativo
        tabBarInactiveTintColor: colors.branco, // <- E aqui define a cor do texto inativo
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
        component={LocaisNavigation}
        // initialParams={{ destinoLatitude: 0, destinoLongitude: 0, localId: "" }}
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

