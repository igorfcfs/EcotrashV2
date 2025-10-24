import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ModalTrocarFotoProps = {
  visible: boolean;
  onClose: () => void;
  onPickGallery: () => void;
  onTakePhoto: () => void;
};

export default function ModalTrocarFoto({
  visible,
  onClose,
  onPickGallery,
  onTakePhoto,
}: ModalTrocarFotoProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.backCard }]}>
          <Ionicons name="image" size={52} color={colors.secundario} style={{ marginBottom: 16 }} />
          <Text style={[styles.title, { color: colors.branco }]}>Trocar foto</Text>
          <Text style={[styles.message, { color: colors.branco, opacity: 0.8 }]}>
            Escolha uma opção para alterar sua foto de perfil.
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.secundario }]}
            onPress={onPickGallery}
          >
            <Ionicons name="images-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Selecionar da galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primario }]}
            onPress={onTakePhoto}
          >
            <Ionicons name="camera-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Tirar uma foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#666', marginTop: 10 }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    marginVertical: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
