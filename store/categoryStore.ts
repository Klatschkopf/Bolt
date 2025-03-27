import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Category } from '@/types/task';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategories: () => Category[];
}

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#FF9AA2' },
  { id: '2', name: 'Personal', color: '#FFB7B2' },
  { id: '3', name: 'Health', color: '#FFDAC1' },
  { id: '4', name: 'Education', color: '#E2F0CB' },
  { id: '5', name: 'Errands', color: '#B5EAD7' },
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,
      addCategory: (category) => {
        const newCategory = {
          ...category,
          id: Math.random().toString(36).substring(7),
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },
      updateCategory: (id, updatedCategory) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updatedCategory } : category
          ),
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },
      getCategories: () => {
        return get().categories;
      },
    }),
    {
      name: 'category-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
