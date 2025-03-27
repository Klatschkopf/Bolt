import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const COLORS = {
  primary: '#7FD4D2',
  primaryLight: '#E8F6F6',
  background: '#FFFFFF',
  text: {
    primary: '#2C3E50',
    secondary: '#94A3B8',
  },
  border: '#E8F6F6',
  danger: '#EF4444',
};

interface ConfirmDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

export default function ConfirmDialog({ visible, onConfirm, onCancel, message }: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 320,
  },
  message: {
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.primaryLight,
  },
  confirmButton: {
    backgroundColor: COLORS.danger,
  },
  cancelButtonText: {
    color: COLORS.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  confirmButtonText: {
    color: COLORS.background,
    textAlign: 'center',
    fontWeight: '500',
  },
});
