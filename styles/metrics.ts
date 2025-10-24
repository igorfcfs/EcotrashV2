// MARGIS, PADDINGS E TAMANHOS CONFIGURADOS PELA PLATAFORMA (StatusBar, BorderRadius etc) - ESPAÇAMENTO E OCUPAÇÃO DE UM COMPONENTE NA TELA

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window'); // Desestruturamento (ES6)

const metricas = {
  smallMargin: 5,
  tripleSmallMargin: 15,
  baseMargin: 10,
  doubleBaseMargin: 20,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  tabBarHeight: 54,
  navBarHeight: Platform.OS === 'ios' ? 64 : 54,
  statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  baseRadius: 3,
};

export default metricas;
