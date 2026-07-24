import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Clock, Eye } from 'lucide-react';
import { Article } from '../types/news.types';
import { useTheme } from '../theme/ThemeContext';
import { useNewsStore } from '../store/newsStore';
import { timeAgo } from '../utils/timeAgo';
import { motion } from 'framer-motion';

interface ArticleCardProps {
  article: Article;
  variant: 'grid' | 'list';
  onPress: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant, onPress }) => {
  const { theme, isDark } = useTheme();
  const { toggleSaveArticle, savedArticles, readArticles } = useNewsStore();
  const isSaved = savedArticles.includes(article.id);
  const isRead = readArticles.includes(article.id);
  const [imgError, setImgError] = useState(false);

  const categoryColors: Record<string, string> = {
    technology: '#3498DB',
    health: '#27AE60',
    science: '#9B59B6',
    business: '#F39C12',
    sports: '#E74C3C',
    entertainment: '#E91E63',
    politics: '#FF5722',
    world: '#00BCD4',
  };

  const catColor = categoryColors[article.category] || theme.accent;

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onPress(article)}
        style={{
          background: theme.cardBackground,
          borderRadius: 16,
          overflow: 'hidden',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
          opacity: isRead ? 0.7 : 1,
        }}
      >
        <div style={{ width: 120, minHeight: 110, position: 'relative', flexShrink: 0 }}>
          {!imgError && article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: `linear-gradient(135deg, ${catColor}40, ${catColor}20)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 28, color: catColor, fontWeight: 700 }}>
                {article.category[0].toUpperCase()}
              </span>
            </div>
          )}
          {isRead && (
            <div style={{
              position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.6)',
              borderRadius: 10, padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 3,
            }}>
              <Eye size={10} color="#fff" />
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 500 }}>Read</span>
            </div>
          )}
        </div>
        <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: 10, fontWeight: 600, color: catColor,
                background: `${catColor}18`, borderRadius: 6, padding: '2px 8px',
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {article.category}
              </span>
            </div>
            <h3 style={{
              fontSize: 14, fontWeight: 600, color: theme.textPrimary,
              lineHeight: 1.35, margin: 0,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {article.title}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>
                {article.source}
              </span>
              <span style={{ fontSize: 10, color: theme.textLight }}>•</span>
              <span style={{ fontSize: 11, color: theme.textLight, whiteSpace: 'nowrap' }}>{timeAgo(article.publishedAt)}</span>
              <span style={{ fontSize: 10, color: theme.textLight }}>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Clock size={10} color={theme.textLight} />
                <span style={{ fontSize: 11, color: theme.textLight }}>{article.readingTime}m</span>
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleSaveArticle(article.id); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                display: 'flex', alignItems: 'center',
              }}
            >
              {isSaved ? (
                <BookmarkCheck size={18} color={theme.accent} fill={theme.accent} />
              ) : (
                <Bookmark size={18} color={theme.textLight} />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onPress(article)}
      style={{
        background: theme.cardBackground,
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
        opacity: isRead ? 0.7 : 1,
        height: '100%',
      }}
    >
      <div style={{ position: 'relative', paddingTop: '56%' }}>
        {!imgError && article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            onError={() => setImgError(true)}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${catColor}60, ${catColor}20)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 40, color: catColor, fontWeight: 700 }}>
              {article.category[0].toUpperCase()}
            </span>
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
        }} />
        {/* Category badge */}
        <span style={{
          position: 'absolute', top: 10, left: 10,
          fontSize: 10, fontWeight: 600, color: '#fff',
          background: catColor, borderRadius: 8, padding: '3px 10px',
          textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          {article.category}
        </span>
        {/* Save button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleSaveArticle(article.id); }}
          style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer',
            borderRadius: '50%', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          {isSaved ? (
            <BookmarkCheck size={16} color="#fff" fill="#fff" />
          ) : (
            <Bookmark size={16} color="#fff" />
          )}
        </button>
        {isRead && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)',
            borderRadius: 10, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Eye size={11} color="#fff" />
            <span style={{ fontSize: 10, color: '#fff', fontWeight: 500 }}>Read</span>
          </div>
        )}
      </div>
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <h3 style={{
          fontSize: 13, fontWeight: 600, color: theme.textPrimary,
          lineHeight: 1.4, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {article.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <span style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>
            {article.source}
          </span>
          <span style={{ fontSize: 10, color: theme.textLight }}>•</span>
          <span style={{ fontSize: 11, color: theme.textLight, whiteSpace: 'nowrap' }}>{timeAgo(article.publishedAt)}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 'auto' }}>
            <Clock size={10} color={theme.textLight} />
            <span style={{ fontSize: 11, color: theme.textLight }}>{article.readingTime}m</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};
