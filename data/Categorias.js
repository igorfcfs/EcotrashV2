const categorias = [
  { nome: 'Pilhas', imagem: require('../assets/pilhas.png') },
  { nome: 'Baterias', imagem: require('../assets/baterias.png') },
  { nome: 'Celulares', imagem: require('../assets/celulares.png') },
  { nome: 'Computadores', imagem: require('../assets/computadores.png') },
  { nome: 'Outros', imagem: require('../assets/outros.png') },
];

const pontosPorCategoriaPorGrama = {
  Pilhas: 1,
  Baterias: 2,
  Celulares: 4,
  Computadores: 5,
  Outros: 3,
};

export {categorias, pontosPorCategoriaPorGrama};