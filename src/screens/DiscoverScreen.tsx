import React from 'react';
import { Settings, LayoutGrid, List, RefreshCw } from 'lucide-react';
import { Article } from '../types/news.types';
import { useTheme } from '../theme/ThemeContext';
import { useNewsStore } from '../store/newsStore';
import { CategoryTabs } from '../components/CategoryTabs';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { ArticleCard } from '../components/ArticleCard';
import { motion } from 'framer-motion';

interface DiscoverScreenProps {
  onArticlePress: (article: Article) => void;
  onSettingsPress: () => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ onArticlePress, onSettingsPress }) => {
  const { theme } = useTheme();
  const { getFilteredArticles, currentView, setView, isLoading, refreshFeed } = useNewsStore();
  const articles = getFilteredArticles();

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: theme.background,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 12px',
        background: theme.headerBackground,
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{
            fontSize: 26, fontWeight: 700, color: theme.textPrimary,
            margin: 0, fontFamily: 'Inter, sans-serif', letterSpacing: -0.5,
          }}>
            <span style={{ color: theme.accent }}>UP</span>DATE
          </h1>
          <p style={{ fontSize: 12, color: theme.textSecondary, margin: '2px 0 0', fontFamily: 'Inter, sans-serif' }}>
            Your personalized news feed
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <motion.button
            whileTap={{ scale: 0.9, rotate: 180 }}
            onClick={refreshFeed}
            style={{
              background: `${theme.accent}12`, border: 'none', cursor: 'pointer',
              borderRadius: '50%', width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <RefreshCw size={18} color={theme.accent} className={isLoading ? 'spin' : ''} />
          </motion.button>
          <div style={{ display: 'flex', gap: 2, background: `${theme.accent}12`, borderRadius: 20, padding: 3 }}>
            <button
              onClick={() => setView('grid')}
              style={{
                background: currentView === 'grid' ? theme.accent : 'transparent',
                border: 'none', cursor: 'pointer',
                borderRadius: 16, width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <LayoutGrid size={15} color={currentView === 'grid' ? '#fff' : theme.textSecondary} />
            </button>
            <button
              onClick={() => setView('list')}
              style={{
                background: currentView === 'list' ? theme.accent : 'transparent',
                border: 'none', cursor: 'pointer',
                borderRadius: 16, width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <List size={15} color={currentView === 'list' ? '#fff' : theme.textSecondary} />
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onSettingsPress}
            style={{
              background: `${theme.accent}12`, border: 'none', cursor: 'pointer',
              borderRadius: '50%', width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Settings size={18} color={theme.accent} />
          </motion.button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px 20px',
      }}>
        {/* Category Tabs */}
        <div style={{ marginBottom: 16 }}>
          <CategoryTabs />
        </div>

        {/* Featured Carousel */}
        <div style={{ marginBottom: 20 }}>
          <FeaturedCarousel articles={articles} onArticlePress={onArticlePress} />
        </div>

        {/* Section Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <h2 style={{
            fontSize: 18, fontWeight: 700, color: theme.textPrimary,
            margin: 0, fontFamily: 'Inter, sans-serif',
          }}>
            Latest News
          </h2>
          <span style={{ fontSize: 13, color: theme.textSecondary }}>
            {articles.length} articles
          </span>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 40,
          }}>
            <div style={{
              width: 32, height: 32, border: `3px solid ${theme.border}`,
              borderTopColor: theme.accent, borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}

        {/* Articles Grid/List */}
        {!isLoading && (
          <div style={{
            display: currentView === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: currentView === 'grid' ? 'repeat(auto-fill, minmax(250px, 1fr))' : undefined,
            flexDirection: currentView === 'list' ? 'column' : undefined,
            gap: currentView === 'grid' ? 16 : 12,
          }}>
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant={currentView}
                onPress={onArticlePress}
              />
            ))}
          </div>
        )}

        {!isLoading && articles.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: 60,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: `${theme.accent}12`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <LayoutGrid size={28} color={theme.accent} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, margin: '0 0 4px' }}>
              No articles found
            </p>
            <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0, textAlign: 'center' }}>
              Try selecting a different category or refresh your feed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
