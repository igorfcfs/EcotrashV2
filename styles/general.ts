// src/styles/general.ts
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { ColorsType } from './colors';
import fonts from './fonts';
import metrics from './metrics';

type GenericStyle = ViewStyle | TextStyle | ImageStyle;

export interface GeneralStyles {
  logo: ViewStyle;
  autenticacao: {
    container: ViewStyle;
    header: ViewStyle;
    tabContainer: ViewStyle;
    tab: ViewStyle;
    tabText: TextStyle;
    activeTabLogIn: ViewStyle;
    activeTabCadastro: ViewStyle;
    activeTabText: TextStyle;
  };
  tabBar: ViewStyle;
  container: ViewStyle;
  container2: ViewStyle;
  container3: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  text: TextStyle;
  textInputs: {
    input: TextStyle;
    infoContainer: ViewStyle;
    label: TextStyle;
  };
  cards: {
    container: ViewStyle;
    containerColumn: ViewStyle;
    cardTotal: ViewStyle;
    cardTitle: TextStyle;
    cardValue: TextStyle;
    percentage: TextStyle;
    selected: ViewStyle;
  };
  passwordContainer: ViewStyle;
  passwordInput: ViewStyle;
  eyeButton: ViewStyle;
  eyeIcon: ImageStyle;
}

// Função que retorna os estilos dinamicamente com base nas cores do tema
export const getGeneralStyles = (colors: ColorsType): GeneralStyles => ({
  logo: {
    alignSelf: 'center',
    padding: 10,
    marginBottom: 30,
    width: 300,
    height: 200,
  },
  autenticacao: {
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.backgroundAuth,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    header: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
      backgroundColor: '#000',
      paddingVertical: 30,
    },
    tabContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      backgroundColor: colors.inverso,
      borderRadius: 50,
      overflow: 'hidden',
      marginBottom: 50,
    },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 50,
    },
    tabText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#555',
    },
    activeTabLogIn: {
      paddingVertical: 10,
      paddingHorizontal: 60,
      backgroundColor: colors.negrito,
    },
    activeTabCadastro: {
      paddingVertical: 10,
      paddingHorizontal: 44,
      backgroundColor: colors.negrito,
    },
    activeTabText: {
      color: '#000',
    },
  },
  tabBar: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  container2: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container3: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.titulo,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
    color: colors.secundario,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.terciario,
  },
  textInputs: {
    input: {
      width: '100%',
      backgroundColor: colors.inverso,
      borderWidth: 0,
      borderColor: colors.primario,
      color: colors.branco,
      borderRadius: 100,
      padding: 12,
      fontSize: fonts.input,
      marginBottom: metrics.tripleSmallMargin,
    },
    infoContainer: {
      width: '90%',
      alignSelf: 'center',
      marginBottom: 20,
    },
    label: {
      color: colors.primario,
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
    },
  },
  cards: {
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    containerColumn: {
      padding: 15,
      backgroundColor: colors.backCard,
      borderRadius: 10,
      marginBottom: metrics.baseMargin,
      elevation: 2,
    },
    cardTotal: {
      backgroundColor: colors.backCard,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primario,
    },
    cardValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primario,
      marginVertical: 5,
    },
    percentage: {
      fontSize: 14,
      color: colors.secundario,
    },
    selected: {
      borderWidth: 2,
      borderColor: colors.primario,
    },
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: '50%' as const,
    transform: [{ translateY: -26 }],
    padding: 8,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#555',
  },
});
