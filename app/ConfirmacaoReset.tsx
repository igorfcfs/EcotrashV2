import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotaoPrimario from '../components/BotaoPrimario';
import { getGeneralStyles } from '../styles/general';

export default function ConfirmacaoReset({ route, navigation }: any) {
  const { colors } = useTheme();
  const general = getGeneralStyles(colors);

  const { email } = route.params;

  return (
    <SafeAreaView style={general.autenticacao.container}>
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.primario, marginBottom: 20 }}>
          E-mail enviado!
        </Text>
        <Text style={{ color: colors.primario, textAlign: 'center', marginBottom: 40 }}>
          Verifique sua caixa de entrada em <Text style={{ fontWeight: 'bold' }}>{email}</Text> para redefinir sua senha.
        </Text>

        <BotaoPrimario text="Voltar para login" onPress={() => navigation.navigate('Login')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
