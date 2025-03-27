import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { format, parse } from 'date-fns';
import { useTaskStore } from '@/store/taskStore';
import { useTimeSettingsStore } from '@/store/timeSettingsStore';
import TaskForm from './TaskForm';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ConfirmDialog from './ConfirmDialog';

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

export default function TimelineView({ selectedDate }: { selectedDate: Date }) {
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const tasks = useTaskStore((state) => state.getTasksForDate(selectedDate));
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const { startTime, endTime, use24Hour } = useTimeSettingsStore();

  const generateTimeSlots = () => {
    const slots = [];
    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());
    let current = start;

    while (current <= end) {
      slots.push(format(current, 'HH:mm'));
      current = new Date(current.getTime() + 60 * 60 * 1000); // Add 1 hour
    }

    return slots;
  };

  const formatDisplayTime = (time: string) => {
    const date = parse(time, 'HH:mm', new Date());
    return format(date, use24Hour ? 'HH:mm' : 'h:mm a');
  };

  const handleTimeSlotPress = (time: string) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
    }
    setShowConfirmDialog(false);
    setTaskToDelete(null);
  };

  const renderTask = (task: Task) => {
    const swipeGesture = Gesture.Pan()
      .activeOffsetX([-20, 20])
      .onEnd((event) => {
        if (event.translationX > 50) {
          toggleTask(task.id);
        } else if (event.translationX < -50) {
          toggleTask(task.id);
        }
      });

    const longPressGesture = Gesture.LongPress()
      .minDuration(1000)
      .onStart(() => {
        setTaskToDelete(task.id);
        setShowConfirmDialog(true);
      });

    const composed = Gesture.Simultaneous(swipeGesture, longPressGesture);

    const taskContent = (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[
          styles.task,
          { backgroundColor: task.color },
          task.completed && styles.completedTask,
        ]}>
        <Text style={styles.taskEmoji}>{task.emoji}</Text>
        <Text style={styles.taskText}>{task.description}</Text>
        <Text style={styles.taskDuration}>{task.duration}min</Text>
      </Animated.View>
    );

    return Platform.OS === 'web' ? (
      <View key={task.id}>{taskContent}</View>
    ) : (
      <GestureDetector gesture={composed} key={task.id}>
        {taskContent}
      </GestureDetector>
    );
  };

  const timeSlots = generateTimeSlots();

  return (
    <>
      <ScrollView style={styles.container}>
        {timeSlots.map((time) => {
          const timeSlotTasks = tasks.filter((task) => task.startTime === time);

          return (
            <View key={time} style={styles.timeSlot}>
              <Text style={styles.time}>{formatDisplayTime(time)}</Text>
              <TouchableOpacity
                style={styles.slotContent}
                onPress={() => handleTimeSlotPress(time)}>
                {timeSlotTasks.map(renderTask)}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <TaskForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        timeSlot={selectedTime}
        date={format(selectedDate, 'yyyy-MM-dd')}
      />

      <ConfirmDialog
        visible={showConfirmDialog}
        message="Are you sure you want to delete this task?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowConfirmDialog(false);
          setTaskToDelete(null);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  timeSlot: {
    flexDirection: 'row',
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  time: {
    width: 80,
    padding: 10,
    color: COLORS.text.secondary,
    fontSize: 12,
  },
  slotContent: {
    flex: 1,
    padding: 5,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.primary,
  },
  taskDuration: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
});
