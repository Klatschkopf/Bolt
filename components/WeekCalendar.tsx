import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { format, addDays, startOfWeek, getWeek, addWeeks, subWeeks } from 'date-fns';
import { useTaskStore } from '@/store/taskStore';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useCallback } from 'react';

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

export default function WeekCalendar({ selectedDate, onSelectDate }: { 
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const getTasksForDate = useTaskStore((state) => state.getTasksForDate);
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });
  const isAnimating = useSharedValue(false);

  const dayItemWidth = Math.min(
    (windowWidth - 32) / 7 - 6,
    60
  );

  const updateSelectedDate = useCallback((direction: 'next' | 'prev') => {
    const newDate = direction === 'next' 
      ? addWeeks(selectedDate, 1)
      : subWeeks(selectedDate, 1);
    onSelectDate(newDate);
  }, [selectedDate, onSelectDate]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      if (!isAnimating.value) {
        translateX.value = event.translationX + context.value.x;
      }
    })
    .onEnd((event) => {
      if (isAnimating.value) return;

      const threshold = windowWidth * 0.3;
      if (Math.abs(event.translationX) > threshold) {
        isAnimating.value = true;
        if (event.translationX > 0) {
          translateX.value = withTiming(windowWidth, {}, () => {
            translateX.value = -windowWidth;
            translateX.value = withTiming(0);
            runOnJS(updateSelectedDate)('prev');
            isAnimating.value = false;
          });
        } else {
          translateX.value = withTiming(-windowWidth, {}, () => {
            translateX.value = windowWidth;
            translateX.value = withTiming(0);
            runOnJS(updateSelectedDate)('next');
            isAnimating.value = false;
          });
        }
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekNumber = getWeek(selectedDate);

  const calendarContent = (
    <Animated.View style={[styles.calendarContainer, animatedStyle]}>
      <View style={styles.daysContainer}>
        {weekDays.map((date) => {
          const dayTasks = getTasksForDate(date);
          const completedTasks = dayTasks.filter(task => task.completed).length;
          const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[
                styles.dayItem,
                { width: dayItemWidth },
                isSelected && styles.selectedDay,
                isToday && styles.today,
              ]}
              onPress={() => onSelectDate(date)}>
              <Text style={[styles.dayName, isSelected && styles.selectedText]}>
                {format(date, 'EEE')}
              </Text>
              <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
                {format(date, 'd')}
              </Text>
              {dayTasks.length > 0 && (
                <View style={styles.taskIndicatorContainer}>
                  <View style={[
                    styles.taskIndicator,
                    isSelected && styles.selectedTaskIndicator
                  ]}>
                    <Text style={[
                      styles.taskCount,
                      isSelected && styles.selectedTaskCount
                    ]}>
                      {completedTasks}/{dayTasks.length}
                    </Text>
                  </View>
                  <View style={[
                    styles.progressBar,
                    isSelected && styles.selectedProgressBar
                  ]}>
                    <View
                      style={[
                        styles.progressFill,
                        isSelected && styles.selectedProgressFill,
                        { width: `${(completedTasks / dayTasks.length) * 100}%` }
                      ]}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.weekNumberBadge}>
          <Text style={styles.weekNumberLabel}>Week</Text>
          <Text style={styles.weekNumberValue}>{weekNumber}</Text>
        </View>
      </View>
      {Platform.OS === 'web' ? (
        calendarContent
      ) : (
        <GestureDetector gesture={gesture}>
          {calendarContent}
        </GestureDetector>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
  },
  weekNumberBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  weekNumberLabel: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  weekNumberValue: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
  calendarContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 6,
  },
  dayItem: {
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.background,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedDay: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  today: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dayName: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 3,
    fontWeight: '500',
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 6,
  },
  selectedText: {
    color: COLORS.background,
  },
  taskIndicatorContainer: {
    width: '100%',
    alignItems: 'center',
  },
  taskIndicator: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 3,
  },
  selectedTaskIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  taskCount: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
  selectedTaskCount: {
    color: COLORS.background,
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  selectedProgressBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  selectedProgressFill: {
    backgroundColor: COLORS.background,
  },
});
