// ARMAZENA AS CORES UTILIZADAS NA APLICAÇÃO

// src/styles/colors.ts

export const Colors = {
  light: {
    primario: '#54592F', // Verde escuro
    secundario: '#B6BF6F', // Verde claro
    terciario: '#1c1c1c', // Preto

    verdeCinza: '#bdbfaa',
    branco: '#000',
    tabBar: '#ffffff',
    marrom: '#a6702e',

    neutro: '#fff',
    inverso: '#fff',

    texto: '#a7aca7',
    fundo: '#ffffff',
    titulo: '#000',
    negrito: '#d1e53d',
    backCard: '#f2f2f0',
    backCardLixoReciclado: '#cbd29b',
    
    backgroundAuth: "#d9d9d9",

    background: '#ffffff',
    backgroundSecundario: '#e6e8d6',
  },
  dark: {
    primario: '#54592F',
    secundario: '#B6BF6F',
    terciario: '#1c1c1c',

    verdeCinza: '#bdbfaa',
    branco: '#f2f2f0',
    tabBar: '#4c4c4c',
    marrom: '#a6702e',

    texto: '#a7aca7',
    fundo: '#e6e8d6',

    neutro: '#fff',
    inverso: '#000',

    titulo: '#fff',
    negrito: '#d1e53d',
    backCard: '#222f22',
    backCardLixoReciclado: '#cbd29b',

    backgroundAuth: "#8e9556",

    background: '#141C14',
    backgroundSecundario: '#E6E8D6',
  },
};

export type ColorsType = typeof Colors.light;
