export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string;
  source: string;
  author: string;
  category: string;
  publishedAt: string;
  isSaved: boolean;
  isRead: boolean;
  readingTime: number;
  keywords: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  articleCount: number;
}

export interface UserPreferences {
  categories: string[];
  sources: string[];
  topics: string[];
  showReadArticles: boolean;
  notificationsEnabled: boolean;
  notificationSchedule: {
    hour: number;
    minute: number;
  };
  darkMode: boolean;
  fontSize: number;
}

export interface AppState {
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
}
