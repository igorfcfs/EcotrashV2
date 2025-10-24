import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CustomModalProps = {
  visible: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;

  // Novo botão opcional de confirmação
  showConfirmButton?: boolean;
  confirmText?: string;
  confirmColor?: string;
  onConfirm?: () => void;
};

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  showConfirmButton = false,
  confirmText = 'Confirmar',
  confirmColor,
  onConfirm,
}) => {
  const { colors } = useTheme();

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={48} color="#4caf50" />;
      case 'error':
        return <Ionicons name="close-circle" size={48} color="#f44336" />;
      case 'info':
        return <Ionicons name="information-circle" size={48} color="#2196f3" />;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.backCard }]}>
          <View style={styles.icon}>{getIcon()}</View>
          <Text style={[styles.title, { color: colors.branco }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.branco, opacity: 0.8 }]}>{message}</Text>

          {/* Botão opcional de confirmação */}
          {showConfirmButton && onConfirm && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: confirmColor || colors.secundario, marginBottom: 10 }]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          )}

          {/* Botão de fechar padrão */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primario }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

// Wrappers
export const ModalSuccess = (props: Omit<CustomModalProps, 'type'>) => <CustomModal {...props} type="success" />;
export const ModalError = (props: Omit<CustomModalProps, 'type'>) => <CustomModal {...props} type="error" />;
export const ModalInfo = (props: Omit<CustomModalProps, 'type'>) => <CustomModal {...props} type="info" />;

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
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
