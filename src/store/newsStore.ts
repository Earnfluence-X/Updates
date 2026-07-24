import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Article, Category, UserPreferences } from '../types/news.types';
import { MOCK_ARTICLES, CATEGORIES, searchArticlesLocal, getArticlesByCategory } from '../data/mockData';

interface NewsStore {
  articles: Article[];
  categories: Category[];
  savedArticles: string[];
  readArticles: string[];
  preferences: UserPreferences;
  searchHistory: string[];
  isLoading: boolean;
  error: string | null;
  currentCategory: string;
  currentView: 'grid' | 'list';
  searchQuery: string;
  searchResults: Article[];
  isSearching: boolean;

  // Article management
  setArticles: (articles: Article[]) => void;
  saveArticle: (id: string) => void;
  unsaveArticle: (id: string) => void;
  toggleSaveArticle: (id: string) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  clearReadArticles: () => void;

  // Category management
  setCurrentCategory: (categoryId: string) => void;
  toggleCategoryPreference: (categoryId: string) => void;

  // Search
  setSearchQuery: (query: string) => void;
  searchArticles: (query: string) => void;
  clearSearch: () => void;
  clearSearchHistory: () => void;

  // Preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  toggleDarkMode: () => void;
  setFontSize: (size: number) => void;

  // Data
  fetchArticles: () => void;
  refreshFeed: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setView: (view: 'grid' | 'list') => void;

  // Computed
  getFilteredArticles: () => Article[];
  getSavedArticlesList: () => Article[];
  getArticleById: (id: string) => Article | undefined;
}

export const useNewsStore = create<NewsStore>()(
  persist(
    (set, get) => ({
      articles: MOCK_ARTICLES,
      categories: CATEGORIES,
      savedArticles: [],
      readArticles: [],
      preferences: {
        categories: ['technology', 'health', 'science', 'business'],
        sources: [],
        topics: [],
        showReadArticles: true,
        notificationsEnabled: true,
        notificationSchedule: { hour: 7, minute: 0 },
        darkMode: false,
        fontSize: 16,
      },
      searchHistory: [],
      isLoading: false,
      error: null,
      currentCategory: 'all',
      currentView: 'grid',
      searchQuery: '',
      searchResults: [],
      isSearching: false,

      setArticles: (articles) => set({ articles }),

      saveArticle: (id) => {
        set((state) => ({
          savedArticles: state.savedArticles.includes(id)
            ? state.savedArticles
            : [...state.savedArticles, id],
          articles: state.articles.map(a =>
            a.id === id ? { ...a, isSaved: true } : a
          ),
        }));
      },

      unsaveArticle: (id) => {
        set((state) => ({
          savedArticles: state.savedArticles.filter(aid => aid !== id),
          articles: state.articles.map(a =>
            a.id === id ? { ...a, isSaved: false } : a
          ),
        }));
      },

      toggleSaveArticle: (id) => {
        const state = get();
        if (state.savedArticles.includes(id)) {
          get().unsaveArticle(id);
        } else {
          get().saveArticle(id);
        }
      },

      markAsRead: (id) => {
        set((state) => ({
          readArticles: state.readArticles.includes(id)
            ? state.readArticles
            : [...state.readArticles, id],
          articles: state.articles.map(a =>
            a.id === id ? { ...a, isRead: true } : a
          ),
        }));
      },

      markAsUnread: (id) => {
        set((state) => ({
          readArticles: state.readArticles.filter(aid => aid !== id),
          articles: state.articles.map(a =>
            a.id === id ? { ...a, isRead: false } : a
          ),
        }));
      },

      clearReadArticles: () => {
        set((state) => ({
          readArticles: [],
          articles: state.articles.map(a => ({ ...a, isRead: false })),
        }));
      },

      setCurrentCategory: (categoryId) => {
        set({ currentCategory: categoryId });
      },

      toggleCategoryPreference: (categoryId) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            categories: state.preferences.categories.includes(categoryId)
              ? state.preferences.categories.filter(c => c !== categoryId)
              : [...state.preferences.categories, categoryId],
          },
        }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      searchArticles: (query) => {
        if (!query.trim()) {
          set({ searchResults: [], isSearching: false });
          return;
        }
        set({ isSearching: true });
        const results = searchArticlesLocal(get().articles, query);
        set((state) => ({
          searchResults: results,
          isSearching: false,
          searchHistory: [
            query,
            ...state.searchHistory.filter(q => q !== query),
          ].slice(0, 20),
        }));
      },

      clearSearch: () => set({ searchQuery: '', searchResults: [], isSearching: false }),

      clearSearchHistory: () => set({ searchHistory: [] }),

      updatePreferences: (updates) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        }));
      },

      toggleDarkMode: () => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            darkMode: !state.preferences.darkMode,
          },
        }));
      },

      setFontSize: (size) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            fontSize: Math.max(12, Math.min(24, size)),
          },
        }));
      },

      fetchArticles: () => {
        set({ isLoading: true, error: null });
        // Simulate API call
        setTimeout(() => {
          set({ articles: MOCK_ARTICLES, isLoading: false });
        }, 800);
      },

      refreshFeed: () => {
        get().fetchArticles();
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setView: (view) => set({ currentView: view }),

      getFilteredArticles: () => {
        const state = get();
        let filtered = getArticlesByCategory(state.articles, state.currentCategory);
        if (!state.preferences.showReadArticles) {
          filtered = filtered.filter(a => !state.readArticles.includes(a.id));
        }
        return filtered;
      },

      getSavedArticlesList: () => {
        const state = get();
        return state.articles.filter(a => state.savedArticles.includes(a.id));
      },

      getArticleById: (id) => {
        return get().articles.find(a => a.id === id);
      },
    }),
    {
      name: 'update-news-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        savedArticles: state.savedArticles,
        readArticles: state.readArticles,
        preferences: state.preferences,
        searchHistory: state.searchHistory,
        currentView: state.currentView,
      }),
    }
  )
);
