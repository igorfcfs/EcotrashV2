const categorias = [
  { id: 1, nome: 'Pilhas', imagem: require('../assets/pilhas.png') },
  { id: 2, nome: 'Baterias', imagem: require('../assets/baterias.png') },
  { id: 3, nome: 'Celulares', imagem: require('../assets/celulares.png') },
  { id: 4, nome: 'Computadores', imagem: require('../assets/computadores.png') },
  { id: 5, nome: 'Outros', imagem: require('../assets/outros.png') },
];

const pontosPorCategoriaPorGrama = {
  Pilhas: 1,
  Baterias: 2,
  Celulares: 4,
  Computadores: 5,
  Outros: 3,
};

export {categorias, pontosPorCategoriaPorGrama};