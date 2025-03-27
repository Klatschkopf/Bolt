import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTaskStore } from '@/store/taskStore';
import { format, startOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';
import { LineChart } from 'react-native-chart-kit';
import { useWindowDimensions } from 'react-native';
import { Trophy, Zap, Target } from 'lucide-react-native';

const COLORS = {
  primary: '#7FD4D2',
  primaryLight: '#E8F6F6',
  background: '#FFFFFF',
  text: {
    primary: '#2C3E50',
    secondary: '#94A3B8',
  },
  border: '#E8F6F6',
  chart: {
    primary: '#7FD4D2',
    secondary: '#94A3B8',
    background: '#FFFFFF',
  },
};

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const tasks = useTaskStore((state) => state.tasks);
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);
  
  // Calculate weekly completion rate
  const weekDays = eachDayOfInterval({
    start: subWeeks(startOfCurrentWeek, 3),
    end: today,
  });

  const weeklyData = weekDays.map(day => {
    const dayTasks = tasks.filter(task => task.date === format(day, 'yyyy-MM-dd'));
    const completedTasks = dayTasks.filter(task => task.completed);
    return dayTasks.length > 0 ? (completedTasks.length / dayTasks.length) * 100 : 0;
  });

  // Calculate overall statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Find longest streak
  let currentStreak = 0;
  let longestStreak = 0;
  let previousDate: Date | null = null;

  tasks.forEach(task => {
    const taskDate = new Date(task.date);
    if (previousDate) {
      const diffDays = Math.abs(taskDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    previousDate = taskDate;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Trophy size={24} color={COLORS.primary} />
          <Text style={styles.statValue}>{completionRate.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>

        <View style={styles.statCard}>
          <Zap size={24} color={COLORS.primary} />
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>

        <View style={styles.statCard}>
          <Target size={24} color={COLORS.primary} />
          <Text style={styles.statValue}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Completed Tasks</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Progress</Text>
        <LineChart
          data={{
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              data: weeklyData
            }]
          }}
          width={width - 32}
          height={220}
          chartConfig={{
            backgroundColor: COLORS.chart.background,
            backgroundGradientFrom: COLORS.chart.background,
            backgroundGradientTo: COLORS.chart.background,
            decimalPlaces: 0,
            color: () => COLORS.chart.primary,
            labelColor: () => COLORS.text.secondary,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: COLORS.chart.primary
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>

      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            {completionRate > 70 
              ? "Great work! You're maintaining a strong completion rate."
              : completionRate > 40
              ? "You're making steady progress. Keep pushing forward!"
              : "Start small and build consistent habits. You've got this!"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  chartContainer: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  insightsContainer: {
    padding: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 16,
  },
  insightText: {
    fontSize: 14,
    color: COLORS.text.primary,
    lineHeight: 20,
  },
});
