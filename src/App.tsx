import React, { useState, useEffect } from 'react';
import { Compass, Search, Bookmark, Settings } from 'lucide-react';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { useNewsStore } from './store/newsStore';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SavedScreen } from './screens/SavedScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ArticleDetail } from './components/ArticleDetail';
import { Article } from './types/news.types';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'discover' | 'search' | 'saved' | 'settings';

const tabs: { id: Tab; label: string; Icon: React.FC<any> }[] = [
  { id: 'discover', label: 'Discover', Icon: Compass },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'saved', label: 'Saved', Icon: Bookmark },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

function AppContent() {
  const { theme } = useTheme();
  const { savedArticles, fetchArticles } = useNewsStore();
  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);


  useEffect(() => {
    fetchArticles();
  }, []);

  const handleArticlePress = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleSettingsPress = () => {
    setActiveTab('settings');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'discover':
        return (
          <DiscoverScreen
            onArticlePress={handleArticlePress}
            onSettingsPress={handleSettingsPress}
          />
        );
      case 'search':
        return <SearchScreen onArticlePress={handleArticlePress} />;
      case 'saved':
        return <SavedScreen onArticlePress={handleArticlePress} />;
      case 'settings':
        return <SettingsScreen onBack={() => setActiveTab('discover')} />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      maxWidth: 480,
      margin: '0 auto',
      background: theme.background,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 0 40px rgba(0,0,0,0.1)',
    }}>
      {/* Screen Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Tab Bar */}
      {activeTab !== 'settings' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px 12px 12px',
          background: theme.tabBar,
          borderTop: `1px solid ${theme.tabBarBorder}`,
          flexShrink: 0,
        }}>
          {tabs.filter(t => t.id !== 'settings').map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            const badgeCount = id === 'saved' ? savedArticles.length : 0;
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 16px',
                  borderRadius: 12,
                  position: 'relative',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Icon
                    size={22}
                    color={isActive ? theme.accent : theme.textLight}
                    fill={isActive && id === 'saved' ? theme.accent : 'none'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {badgeCount > 0 && (
                    <span style={{
                      position: 'absolute', top: -6, right: -10,
                      background: theme.error, color: '#fff',
                      fontSize: 9, fontWeight: 700,
                      minWidth: 16, height: 16,
                      borderRadius: 8, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      padding: '0 4px',
                    }}>
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? theme.accent : theme.textLight,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    style={{
                      position: 'absolute', top: -8,
                      width: 20, height: 3, borderRadius: 2,
                      background: theme.accent,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
