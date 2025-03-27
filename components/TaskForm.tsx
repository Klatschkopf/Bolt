import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTaskStore } from '@/store/taskStore';
import { useCategoryStore } from '@/store/categoryStore';

const COLORS = {
  primary: '#7FD4D2',
  primaryLight: '#E8F6F6',
  background: '#FFFFFF',
  text: {
    primary: '#2C3E50',
    secondary: '#94A3B8',
  },
  border: '#E8F6F6',
};

const TASK_COLORS = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
const EMOJIS = ['📝', '💼', '🏃‍♂️', '🎨', '📚', '🎵', '🍽️', '🧘‍♂️'];

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  timeSlot: string;
  date: string;
}

export default function TaskForm({ visible, onClose, timeSlot, date }: TaskFormProps) {
  const addTask = useTaskStore((state) => state.addTask);
  const categories = useCategoryStore((state) => state.categories);
  
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [selectedColor, setSelectedColor] = useState(TASK_COLORS[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSubmit = () => {
    if (description.trim()) {
      addTask({
        description,
        startTime: timeSlot,
        duration,
        color: selectedColor,
        emoji: selectedEmoji,
        completed: false,
        date,
        category: selectedCategory,
      });
      onClose();
      setDescription('');
      setDuration(30);
      setSelectedColor(TASK_COLORS[0]);
      setSelectedEmoji(EMOJIS[0]);
      setSelectedCategory(null);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>New Task at {timeSlot}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Task description"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === null && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(null)}>
                <Text style={styles.categoryText}>None</Text>
              </TouchableOpacity>
              
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: category.color + '40' }, // Adding transparency
                    selectedCategory === category.id && styles.selectedCategory,
                    selectedCategory === category.id && { backgroundColor: category.color },
                  ]}
                  onPress={() => setSelectedCategory(category.id)}>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Duration (minutes)</Text>
            <View style={styles.durationContainer}>
              {[15, 30, 45, 60, 90, 120].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.durationButton,
                    duration === mins && styles.selectedDuration,
                  ]}
                  onPress={() => setDuration(mins)}>
                  <Text style={[
                    styles.durationText,
                    duration === mins && styles.selectedDurationText,
                  ]}>{mins}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Color</Text>
            <View style={styles.colorContainer}>
              {TASK_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <Text style={styles.label}>Emoji</Text>
            <View style={styles.emojiContainer}>
              {EMOJIS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === emoji && styles.selectedEmoji,
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}>
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Create Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  formContainer: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: COLORS.text.primary,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: COLORS.text.primary,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.text.primary,
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  durationButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedDuration: {
    backgroundColor: COLORS.primary,
  },
  durationText: {
    color: COLORS.text.primary,
  },
  selectedDurationText: {
    color: COLORS.background,
  },
  colorContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: COLORS.text.primary,
  },
  emojiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  emojiButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.primaryLight,
  },
  selectedEmoji: {
    backgroundColor: COLORS.primary,
  },
  emoji: {
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    marginRight: 10,
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  submitButtonText: {
    color: COLORS.background,
    textAlign: 'center',
    fontWeight: '500',
  },
});
