import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Platform } from 'react-native';
import { useTaskStore } from '@/store/taskStore';
import { Database, Upload, Download, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import ConfirmDialog from './ConfirmDialog';

export default function DataManagement() {
  const { colors } = useTheme();
  const { exportTasks, importTasks, clearAllTasks } = useTaskStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = async () => {
    try {
      const jsonData = await exportTasks();
      if (Platform.OS === 'web') {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        await Share.share({
          message: jsonData,
          title: 'Tasks Backup',
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async () => {
    // Note: In a real app, you'd implement a file picker here
    // For this example, we'll just show how the import function would work
    try {
      const dummyData = '[{"id":"1","description":"Sample Task","completed":false}]';
      await importTasks(dummyData);
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const handleClearData = () => {
    setShowClearConfirm(true);
  };

  const confirmClearData = () => {
    clearAllTasks();
    setShowClearConfirm(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.background }]} 
        onPress={handleExport}
      >
        <Download size={20} color={colors.text.primary} />
        <Text style={[styles.buttonText, { color: colors.text.primary }]}>Export Data</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.background }]} 
        onPress={handleImport}
      >
        <Upload size={20} color={colors.text.primary} />
        <Text style={[styles.buttonText, { color: colors.text.primary }]}>Import Data</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.background }]} 
        onPress={handleClearData}
      >
        <Trash2 size={20} color={colors.error} />
        <Text style={[styles.buttonText, { color: colors.error }]}>Clear All Data</Text>
      </TouchableOpacity>

      <ConfirmDialog
        visible={showClearConfirm}
        message="Are you sure you want to clear all data? This action cannot be undone."
        onConfirm={confirmClearData}
        onCancel={() => setShowClearConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
  },
});
