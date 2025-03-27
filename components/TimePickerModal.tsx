import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { format, parse } from 'date-fns';
import { useTheme } from '@/theme/ThemeContext';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onTimeSelected: (time: string) => void;
  timeOptions: string[];
  selectedTime: string;
  use24Hour: boolean;
  title: string;
}

export default function TimePickerModal({
  visible,
  onClose,
  onTimeSelected,
  timeOptions,
  selectedTime,
  use24Hour,
  title,
}: TimePickerModalProps) {
  const { colors } = useTheme();

  const formatTimeOption = (time: string) => {
    const date = parse(time, 'HH:mm', new Date());
    return format(date, use24Hour ? 'HH:mm' : 'h:mm a');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: colors.primaryLight }]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: colors.text.primary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.timeList}>
            {timeOptions.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeOption,
                  { backgroundColor: colors.primaryLight },
                  time === selectedTime && { backgroundColor: colors.primary },
                ]}
                onPress={() => {
                  onTimeSelected(time);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.timeText,
                    { color: colors.text.primary },
                    time === selectedTime && { color: colors.background },
                  ]}
                >
                  {formatTimeOption(time)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeList: {
    maxHeight: '80%',
  },
  timeOption: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
