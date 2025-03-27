import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { useCategoryStore } from '@/store/categoryStore';
import { Category } from '@/types/task';
import { Edit, Trash2 } from 'lucide-react-native';

const COLORS = {
  primary: '#7FD4D2',
  primaryLight: '#E8F6F6',
  background: '#FFFFFF',
  text: {
    primary: '#2C3E50',
    secondary: '#94A3B8',
  },
  border: '#E8F6F6',
  danger: '#FF6B6B',
};

const CATEGORY_COLORS = [
  '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA',
  '#F4BFBF', '#FFD8CC', '#FAF0D7', '#8CC0DE', '#CCDBFD', '#C8B6FF'
];

interface CategoryManagerProps {
  visible: boolean;
  onClose: () => void;
}

export default function CategoryManager({ visible, onClose }: CategoryManagerProps) {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      if (editingCategory) {
        updateCategory(editingCategory.id, {
          name: newCategoryName,
          color: selectedColor
        });
        setEditingCategory(null);
      } else {
        addCategory({
          name: newCategoryName,
          color: selectedColor
        });
      }
      setNewCategoryName('');
      setSelectedColor(CATEGORY_COLORS[0]);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setSelectedColor(category.color);
  };

  const handleDeleteCategory = (id: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? Tasks with this category will not be deleted, but they will no longer have a category assigned.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteCategory(id)
        }
      ]
    );
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setSelectedColor(CATEGORY_COLORS[0]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {editingCategory ? 'Edit Category' : 'Manage Categories'}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            
            <View style={styles.colorPickerContainer}>
              <Text style={styles.colorPickerLabel}>Select Color:</Text>
              <View style={styles.colorPicker}>
                {CATEGORY_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorOption
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.actionButtons}>
              {editingCategory && (
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.addButton, !newCategoryName.trim() && styles.disabledButton]} 
                onPress={handleAddCategory}
                disabled={!newCategoryName.trim()}>
                <Text style={styles.addButtonText}>
                  {editingCategory ? 'Update' : 'Add Category'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryColor, { backgroundColor: item.color }]} />
                  <Text style={styles.categoryName}>{item.name}</Text>
                </View>
                <View style={styles.categoryActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditCategory(item)}>
                    <Edit size={18} color={COLORS.text.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCategory(item.id)}>
                    <Trash2 size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No categories yet. Add one above!</Text>
            }
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
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
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.text.primary,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: COLORS.text.primary,
  },
  colorPickerContainer: {
    marginBottom: 15,
  },
  colorPickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text.primary,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: COLORS.text.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
  },
  addButtonText: {
    color: COLORS.background,
    textAlign: 'center',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    flex: 1,
  },
  cancelButtonText: {
    color: COLORS.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  categoryActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    marginRight: 5,
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.text.secondary,
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: COLORS.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
