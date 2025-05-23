// GERAL.JS: ARMAZENA ESTILOS DE COMPONENTES PADRÃO

import metrics from './metrics';
import colors from './colors';
import fonts from './fonts';

const general = {
  logo: {
    alignSelf: "center",
    padding: 10,
    marginBottom: 30,
    width: 300,
    height: 200,
  },
  tabBar: {
    flex: 1,
    paddingTop: 30,
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
    alignItems: 'center'
  },
  container3: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  textInputs: {
    input: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: colors.primario, // Verde moderno
        color: colors.primario, // Verde escuro
        borderRadius: 5, // Bordas mais arredondadas
        padding: 15,
        fontSize: fonts.input, //16
        marginBottom: metrics.tripleSmallMargin, //15
        shadowColor: '#000', // Sombras para melhor visualização
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2, // Efeito de sombra no Android
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.primario,
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
    fontWeight: 'medium',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.terciario
  },
  cards: {
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    containerColumn: {
      padding: 20,
      backgroundColor: '#FFF',
      padding: 15,
      borderRadius: 10,
      marginBottom: metrics.baseMargin,
      elevation: 2,
    },
    cardTotal: {
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
      elevation: 3, // Sombras no Android
      shadowColor: '#000', // Sombras no iOS
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
      borderColor: colors.primario
    }
  }
};

export default general;
