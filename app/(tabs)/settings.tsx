import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTaskStore } from '@/store/taskStore';
import { useTimeSettingsStore } from '@/store/timeSettingsStore';
import { useState } from 'react';
import { parse, format, isAfter } from 'date-fns';
import { Clock, Moon, Bell, Database, Info } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import DataManagement from '@/components/DataManagement';
import TimePickerModal from '@/components/TimePickerModal';

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:30`];
}).flat();

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();
  const tasks = useTaskStore((state) => state.tasks);
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  
  const { startTime, endTime, use24Hour, setStartTime, setEndTime, toggleTimeFormat } = useTimeSettingsStore();
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleStartTimeChange = (newTime: string) => {
    const startDate = parse(newTime, 'HH:mm', new Date());
    const endDate = parse(endTime, 'HH:mm', new Date());

    if (isAfter(startDate, endDate)) {
      setError('Start time cannot be later than end time');
      return;
    }

    setError(null);
    setStartTime(newTime);
  };

  const handleEndTimeChange = (newTime: string) => {
    const startDate = parse(startTime, 'HH:mm', new Date());
    const endDate = parse(newTime, 'HH:mm', new Date());

    if (isAfter(startDate, endDate)) {
      setError('End time cannot be earlier than start time');
      return;
    }

    setError(null);
    setEndTime(newTime);
  };

  const formatTimeOption = (time: string) => {
    const date = parse(time, 'HH:mm', new Date());
    return format(date, use24Hour ? 'HH:mm' : 'h:mm a');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text.primary }]}>Settings</Text>

      <View style={[styles.section, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Time Display Settings</Text>
        
        <View style={styles.timeSettings}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Start Time</Text>
            <TouchableOpacity
              style={[styles.timeButton, { backgroundColor: colors.background }]}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={[styles.timeButtonText, { color: colors.text.primary }]}>
                {formatTimeOption(startTime)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text.primary }]}>End Time</Text>
            <TouchableOpacity
              style={[styles.timeButton, { backgroundColor: colors.background }]}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={[styles.timeButtonText, { color: colors.text.primary }]}>
                {formatTimeOption(endTime)}
              </Text>
            </TouchableOpacity>
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>App Settings</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingToggle}>
            <Clock size={20} color={colors.text.primary} />
            <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Use 24-hour format</Text>
          </View>
          <Switch
            value={use24Hour}
            onValueChange={toggleTimeFormat}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingToggle}>
            <Moon size={20} color={colors.text.primary} />
            <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Dark Mode</Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingToggle}>
            <Bell size={20} color={colors.text.primary} />
            <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Data Management</Text>
        <DataManagement />
      </View>

      <View style={[styles.section, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>About</Text>
        <View style={styles.aboutContainer}>
          <Info size={20} color={colors.text.primary} />
          <Text style={[styles.versionText, { color: colors.text.primary }]}>Version 1.0.0</Text>
        </View>
      </View>

      <TimePickerModal
        visible={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        onTimeSelected={handleStartTimeChange}
        timeOptions={TIME_OPTIONS}
        selectedTime={startTime}
        use24Hour={use24Hour}
        title="Select Start Time"
      />

      <TimePickerModal
        visible={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        onTimeSelected={handleEndTimeChange}
        timeOptions={TIME_OPTIONS}
        selectedTime={endTime}
        use24Hour={use24Hour}
        title="Select End Time"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    padding: 20,
    paddingTop: 60,
  },
  section: {
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  timeSettings: {
    gap: 20,
  },
  settingRow: {
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  timeButton: {
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  timeButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  settingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 8,
  },
  aboutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  versionText: {
    fontSize: 16,
  },
});
