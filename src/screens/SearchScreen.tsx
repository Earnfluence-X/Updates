import React, { useState, useRef, useEffect } from 'react';
import {
  Search, X, Clock, TrendingUp, Filter, ChevronDown, Trash2,
} from 'lucide-react';
import { Article } from '../types/news.types';
import { useTheme } from '../theme/ThemeContext';
import { useNewsStore } from '../store/newsStore';
import { ArticleCard } from '../components/ArticleCard';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchScreenProps {
  onArticlePress: (article: Article) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onArticlePress }) => {
  const { theme } = useTheme();
  const {
    searchQuery, setSearchQuery, searchArticles, searchResults,
    searchHistory, clearSearchHistory, clearSearch, categories,
    isSearching,
  } = useNewsStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { savedArticles } = useNewsStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (query: string) => {
    setLocalQuery(query);
    setSearchQuery(query);
    if (query.trim()) {
      searchArticles(query);
    } else {
      clearSearch();
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    clearSearch();
    inputRef.current?.focus();
  };

  const handleHistoryClick = (query: string) => {
    setLocalQuery(query);
    setSearchQuery(query);
    searchArticles(query);
  };

  const filteredResults = searchResults.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (savedOnly && !savedArticles.includes(a.id)) return false;
    return true;
  });

  const suggestedTopics = ['AI', 'Climate', 'Markets', 'Space', 'Health', 'Sports', 'Politics', 'Tech'];

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', height: '100%',
      background: theme.background,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 12px',
        background: theme.headerBackground,
        borderBottom: `1px solid ${theme.border}`,
        flexShrink: 0,
      }}>
        <h1 style={{
          fontSize: 26, fontWeight: 700, color: theme.textPrimary,
          margin: '0 0 14px', fontFamily: 'Inter, sans-serif', letterSpacing: -0.5,
        }}>
          Search
        </h1>

        {/* Search bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: theme.inputBackground,
          borderRadius: 14, padding: '10px 14px',
          border: `1.5px solid ${theme.border}`,
          transition: 'border-color 0.2s',
        }}>
          <Search size={18} color={theme.textSecondary} />
          <input
            ref={inputRef}
            value={localQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search articles, topics, sources..."
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 15,
              background: 'transparent', color: theme.textPrimary,
              fontFamily: 'Inter, sans-serif',
            }}
          />
          {localQuery && (
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleClear}
              style={{
                background: `${theme.textLight}30`, border: 'none', cursor: 'pointer',
                borderRadius: '50%', width: 24, height: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={14} color={theme.textSecondary} />
            </motion.button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              background: showFilters ? theme.accent : `${theme.accent}15`,
              border: 'none', cursor: 'pointer',
              borderRadius: 10, padding: '6px 10px',
              display: 'flex', alignItems: 'center', gap: 4,
              transition: 'all 0.2s',
            }}
          >
            <Filter size={14} color={showFilters ? '#fff' : theme.accent} />
            <ChevronDown
              size={12}
              color={showFilters ? '#fff' : theme.accent}
              style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginTop: 10 }}
            >
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                <button
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                    background: selectedCategory === 'all' ? theme.accent : `${theme.accent}12`,
                    color: selectedCategory === 'all' ? '#fff' : theme.textSecondary,
                  }}
                >
                  All Categories
                </button>
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                      fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                      background: selectedCategory === cat.id ? theme.accent : `${theme.accent}12`,
                      color: selectedCategory === cat.id ? '#fff' : theme.textSecondary,
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSavedOnly(!savedOnly)}
                style={{
                  padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                  background: savedOnly ? theme.success : `${theme.success}12`,
                  color: savedOnly ? '#fff' : theme.textSecondary,
                }}
              >
                Saved Only
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px' }}>
        {/* No query state */}
        {!localQuery && (
          <>
            {/* Suggested Topics */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <TrendingUp size={16} color={theme.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary, margin: 0, fontFamily: 'Inter, sans-serif' }}>
                  Trending Topics
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {suggestedTopics.map((topic) => (
                  <motion.button
                    key={topic}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSearch(topic)}
                    style={{
                      padding: '8px 18px', borderRadius: 24, border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                      background: theme.cardBackground, color: theme.textPrimary,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    }}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {searchHistory.length > 0 && (
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={16} color={theme.textSecondary} />
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary, margin: 0, fontFamily: 'Inter, sans-serif' }}>
                      Recent Searches
                    </h3>
                  </div>
                  <button
                    onClick={clearSearchHistory}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 4,
                      color: theme.error, fontSize: 12, fontWeight: 500,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <Trash2 size={12} />
                    Clear
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {searchHistory.map((query, i) => (
                    <motion.button
                      key={`${query}-${i}`}
                      whileHover={{ x: 4 }}
                      onClick={() => handleHistoryClick(query)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 12px', borderRadius: 12,
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        textAlign: 'left', width: '100%',
                      }}
                    >
                      <Clock size={14} color={theme.textLight} />
                      <span style={{ fontSize: 14, color: theme.textPrimary, fontFamily: 'Inter, sans-serif' }}>
                        {query}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Search results */}
        {localQuery && (
          <>
            {isSearching ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <div style={{
                  width: 32, height: 32, border: `3px solid ${theme.border}`,
                  borderTopColor: theme.accent, borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
              </div>
            ) : (
              <>
                <p style={{
                  fontSize: 13, color: theme.textSecondary, margin: '0 0 14px',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{localQuery}"
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filteredResults.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="list"
                      onPress={onArticlePress}
                    />
                  ))}
                </div>
                {filteredResults.length === 0 && (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', padding: 60,
                  }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: `${theme.textLight}20`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                    }}>
                      <Search size={28} color={theme.textLight} />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, margin: '0 0 4px' }}>
                      No results found
                    </p>
                    <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0, textAlign: 'center' }}>
                      Try different keywords or browse categories.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
