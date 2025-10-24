// app/(tabs)/locais/LocaisStack.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocalScreen from './app/(tabs)/locais/Local';
import MapaScreen from './app/(tabs)/locais/Mapa';

export type LocaisStackParamList = {
  Mapa: { destinoLatitude: number; destinoLongitude: number; localId: string } | undefined;
  Local: { localId: string };
};

const Stack = createNativeStackNavigator<LocaisStackParamList>();

export default function LocaisStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: colors.secundario },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <Stack.Screen name="Mapa" component={MapaScreen} options={{ title: 'Mapa', headerShown: false }} />
      <Stack.Screen name="Local" component={LocalScreen} options={{ title: 'Local' }} />
    </Stack.Navigator>
  );
}
