import MapaScreen from './screens/Mapa';
import EcopontosScreen from './screens/Ecopontos';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native';
import { colors, general } from './styles';

const Tab = createMaterialTopTabNavigator();

export default function RelatorioNavigation() {
  return (
    <SafeAreaView style={general.tabBar}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarActiveTintColor: colors.primario,
          tabBarInactiveTintColor: 'gray',
          tabBarIndicatorStyle: { backgroundColor: colors.primario, height: 3 },
          tabBarStyle: {
            backgroundColor: '#fff',
            elevation: 3,
          },
        }}
      > 
        <Tab.Screen name="Mapa" component={MapaScreen} />
        <Tab.Screen name="Ecopontos" component={EcopontosScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
