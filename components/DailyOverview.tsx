import { View, Text, StyleSheet } from 'react-native';
import { useTaskStore } from '@/store/taskStore';
import { format } from 'date-fns';

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

export default function DailyOverview({ selectedDate }: { selectedDate: Date }) {
  const tasks = useTaskStore((state) => state.getTasksForDate(selectedDate));
  const completedTasks = tasks.filter(task => task.completed).length;
  const remainingTasks = tasks.length - completedTasks;
  const completionPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.section}>
        <Text style={styles.totalTasks}>{tasks.length}</Text>
        <Text style={styles.label}>Total Tasks</Text>
        <Text style={styles.dateInfo}>
          {format(selectedDate, 'MMM d')}
        </Text>
      </View>

      {/* Center Section */}
      <View style={styles.centerSection}>
        <View style={styles.progressRing}>
          <View style={[styles.progressBackground]} />
          <View style={[
            styles.progressFill,
            { transform: [{ rotate: `${(completionPercentage * 3.6) - 180}deg` }] }
          ]} />
          <View style={styles.progressContent}>
            <Text style={styles.remainingNumber}>{remainingTasks}</Text>
            <Text style={styles.remainingLabel}>remaining</Text>
          </View>
        </View>
      </View>

      {/* Right Section */}
      <View style={styles.section}>
        <Text style={styles.completedTasks}>{completedTasks}</Text>
        <Text style={styles.label}>Completed</Text>
        <Text style={styles.dateInfo}>
          {format(selectedDate, 'yyyy')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  totalTasks: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  completedTasks: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  dateInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  progressRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 50,
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    transformOrigin: '50% 50%',
    borderRadius: 50,
  },
  progressContent: {
    backgroundColor: COLORS.background,
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  remainingNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  remainingLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: -2,
  },
});
