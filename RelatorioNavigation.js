import React from 'react';
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
          tabBarActiveTintColor: colors.primario,
          tabBarInactiveTintColor: 'gray',
          tabBarIndicatorStyle: { backgroundColor: colors.primario, height: 3 },
          tabBarStyle: {
            backgroundColor: '#fff',
            elevation: 3,
          },
        }}
      >
        <Tab.Screen name="Estatísticas" component={RelatorioGeralScreen} />
        <Tab.Screen name="Histórico" component={RelatorioEletronicosScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

