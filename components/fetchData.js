import {auth, db} from '../firebaseConfig';
import {doc, getDoc} from 'firebase/firestore';

const fetchData = async (collection) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, collection, user.uid);
      console.log(user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        console.log('Dados do Firestore:', data);
        setPontosAcumulados(data.pontos ?? 10); //|| retorna o primeiro valor Thruthy, 0 e falsy; portanto, ?? substitui apenas se o dado for null ou undefined 
        setMateriaPrimaDescartada(data.materia_prima ?? 10);
      } else {
        console.log('Dados não encontrado no Firestore.');
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
};

export default fetchData;