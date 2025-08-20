import { SafeAreaView, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RelatorioGeralScreen from './screens/RelatorioGeral';
import RelatorioEletronicosScreen from './screens/RelatorioEletronicos';
import { colors, general } from './styles';

const Tab = createMaterialTopTabNavigator();

export default function RelatorioNavigation() {
  return (
    <SafeAreaView style={general.tabBar}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarActiveTintColor: colors.marrom, // laranja do print (Estatísticas ativo)
          tabBarInactiveTintColor: '#FFFFFF', // branco para os inativos
          tabBarIndicatorStyle: { backgroundColor: colors.marrom, height: 3 }, // roxo do sublinhado
          tabBarStyle: {
           backgroundColor: colors.backCard,
            elevation: 0,
            marginHorizontal: 16, // margem nas laterais
            marginTop: 8,         // opcional, só pra dar respiro em cima
            borderRadius: 50,     // arredondamento
            overflow: 'hidden',   // garante que o conteúdo respeite o arredondamento
          },
        }}
      >
        <Tab.Screen name="Estatísticas" component={RelatorioGeralScreen} />
        <Tab.Screen name="Histórico" component={RelatorioEletronicosScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
