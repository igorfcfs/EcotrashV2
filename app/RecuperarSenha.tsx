import { useTheme } from '@/contexts/ThemeContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotaoPrimario from '../components/BotaoPrimario';
import { ModalError, ModalInfo } from '../components/CustomModal';
import Input from '../components/Input';
import Titulo from '../components/Titulo';
import { auth } from '../firebaseConfig';
import { getGeneralStyles } from '../styles/general';

export default function RecuperarSenha({ navigation }: any) {
  const { colors } = useTheme();
  const general = getGeneralStyles(colors);

  const [email, setEmail] = useState('');

  // Controle de modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'error' | 'info'>('info');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  // Função auxiliar para exibir modal
  const showModal = (
    type: 'error' | 'info',
    title: string,
    message: string
  ) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  function handleResetPassword() {
    if (!email) {
      showModal('error', 'Aviso', 'Por favor, insira seu e-mail.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        showModal(
          'info',
          'E-mail enviado',
          'Verifique sua caixa de entrada para redefinir sua senha.'
        );
      })
      .catch(error => {
        console.error('Erro ao enviar e-mail de redefinição:', error);
        let errorMessage = 'Erro ao enviar e-mail.';
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'E-mail inválido.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Nenhum usuário encontrado com esse e-mail.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Falha na conexão. Verifique sua internet.';
            break;
        }
        showModal('error', 'Erro', errorMessage);
      });
  }

  return (
    <>
      <SafeAreaView style={general.autenticacao.container}>
        <View style={{ marginBottom: 20 }}>
          <Titulo
            text="Recuperar Senha"
            style={{
              color: colors.primario,
              fontSize: 24,
              marginBottom: 10,
            }}
          />
          <Text style={{ color: colors.primario }}>
            Digite seu e-mail para receber o link de redefinição de senha.
          </Text>
        </View>

        <Input
          placeholder="Seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={{ marginTop: 20 }}>
          <BotaoPrimario text="Enviar e-mail" onPress={handleResetPassword} />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 15 }}
          >
            <Text style={{ color: colors.primario, textAlign: 'center' }}>
              Voltar para login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Modal de erro */}
      <ModalError
        visible={modalVisible && modalType === 'error'}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />

      {/* Modal informativo de sucesso */}
      <ModalInfo
        visible={modalVisible && modalType === 'info'}
        title={modalTitle}
        message={modalMessage}
        showConfirmButton
        confirmText="OK"
        onConfirm={() => {
          setModalVisible(false);
          navigation.navigate('ConfirmacaoReset', { email });
        }}
        onClose={() => {
          setModalVisible(false);
          navigation.navigate('ConfirmacaoReset', { email });
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({});
