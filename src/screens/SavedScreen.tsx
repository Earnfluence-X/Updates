import React, { useState } from 'react';
import {
  Bookmark, Trash2, BookmarkX,
} from 'lucide-react';
import { Article } from '../types/news.types';
import { useTheme } from '../theme/ThemeContext';
import { useNewsStore } from '../store/newsStore';
import { ArticleCard } from '../components/ArticleCard';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedScreenProps {
  onArticlePress: (article: Article) => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({ onArticlePress }) => {
  const { theme } = useTheme();
  const {
    getSavedArticlesList, savedArticles, readArticles,
    unsaveArticle,
  } = useNewsStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const saved = getSavedArticlesList();
  const filtered = filter === 'unread'
    ? saved.filter(a => !readArticles.includes(a.id))
    : saved;

  const handleClearAll = () => {
    saved.forEach(a => unsaveArticle(a.id));
    setShowConfirmClear(false);
  };

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h1 style={{
              fontSize: 26, fontWeight: 700, color: theme.textPrimary,
              margin: 0, fontFamily: 'Inter, sans-serif', letterSpacing: -0.5,
            }}>
              Saved
            </h1>
            <p style={{ fontSize: 12, color: theme.textSecondary, margin: '2px 0 0', fontFamily: 'Inter, sans-serif' }}>
              {savedArticles.length} article{savedArticles.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          {saved.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowConfirmClear(true)}
              style={{
                background: `${theme.error}12`, border: 'none', cursor: 'pointer',
                borderRadius: 10, padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: 6,
                color: theme.error, fontSize: 13, fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Trash2 size={14} />
              Clear All
            </motion.button>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: filter === f ? 600 : 500,
                fontFamily: 'Inter, sans-serif',
                background: filter === f ? theme.accent : `${theme.accent}12`,
                color: filter === f ? '#fff' : theme.textSecondary,
                transition: 'all 0.2s',
              }}
            >
              {f === 'all' ? `All (${saved.length})` : `Unread (${saved.filter(a => !readArticles.includes(a.id)).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px' }}>
        <AnimatePresence>
          {filtered.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map((article) => (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  style={{ position: 'relative' }}
                >
                  <ArticleCard
                    article={article}
                    variant="list"
                    onPress={onArticlePress}
                  />
                  {/* Swipe-to-delete hint */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => unsaveArticle(article.id)}
                    style={{
                      position: 'absolute', top: 8, right: -4,
                      background: theme.error, border: 'none', cursor: 'pointer',
                      borderRadius: '50%', width: 26, height: 26,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(231,76,60,0.3)',
                    }}
                  >
                    <BookmarkX size={12} color="#fff" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: 60,
              }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: `${theme.accent}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <Bookmark size={36} color={theme.accent} />
              </div>
              <p style={{
                fontSize: 18, fontWeight: 700, color: theme.textPrimary,
                margin: '0 0 8px', fontFamily: 'Inter, sans-serif',
              }}>
                {filter === 'unread' ? 'All caught up!' : 'No saved articles'}
              </p>
              <p style={{
                fontSize: 14, color: theme.textSecondary, margin: 0,
                textAlign: 'center', maxWidth: 280, lineHeight: 1.5,
                fontFamily: 'Inter, sans-serif',
              }}>
                {filter === 'unread'
                  ? 'You\'ve read all your saved articles. Great job staying informed!'
                  : 'Tap the bookmark icon on any article to save it for later reading.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm clear modal */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmClear(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: theme.overlay,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: theme.cardBackground,
                borderRadius: 20, padding: 28,
                width: '100%', maxWidth: 340,
                textAlign: 'center',
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: `${theme.error}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Trash2 size={24} color={theme.error} />
              </div>
              <h3 style={{
                fontSize: 18, fontWeight: 700, color: theme.textPrimary,
                margin: '0 0 8px', fontFamily: 'Inter, sans-serif',
              }}>
                Clear All Saved?
              </h3>
              <p style={{
                fontSize: 14, color: theme.textSecondary, margin: '0 0 24px',
                lineHeight: 1.5, fontFamily: 'Inter, sans-serif',
              }}>
                This will remove all {saved.length} saved articles. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 12,
                    background: `${theme.textSecondary}15`, border: 'none',
                    cursor: 'pointer', color: theme.textPrimary,
                    fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 12,
                    background: theme.error, border: 'none',
                    cursor: 'pointer', color: '#fff',
                    fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
