import { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import WeekCalendar from '@/components/WeekCalendar';
import TimelineView from '@/components/TimelineView';
import DailyOverview from '@/components/DailyOverview';
import PageContainer from '@/components/PageContainer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

export default function TasksScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <WeekCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <DailyOverview selectedDate={selectedDate} />
        </View>
        <View style={styles.content}>
          <PageContainer
            currentIndex={currentPage}
            totalPages={3}
            onChangePage={setCurrentPage}
          >
            <TimelineView selectedDate={selectedDate} />
          </PageContainer>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  content: {
    flex: 1,
  },
});
