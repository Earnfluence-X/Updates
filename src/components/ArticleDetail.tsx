import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2, ExternalLink, Clock, Eye, EyeOff,
} from 'lucide-react';
import { Article } from '../types/news.types';
import { useTheme } from '../theme/ThemeContext';
import { useNewsStore } from '../store/newsStore';
import { timeAgo } from '../utils/timeAgo';
import { motion, AnimatePresence } from 'framer-motion';

interface ArticleDetailProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => {
  const { theme } = useTheme();
  const { toggleSaveArticle, savedArticles, markAsRead, markAsUnread, readArticles, preferences } = useNewsStore();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (article) {
      markAsRead(article.id);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [article]);

  if (!article) return null;

  const isSaved = savedArticles.includes(article.id);
  const isRead = readArticles.includes(article.id);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      });
    } else {
      await navigator.clipboard.writeText(article.url);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: theme.overlay,
          display: 'flex', justifyContent: 'center',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 600,
            height: '100%',
            background: theme.background,
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {/* Header image */}
          <div style={{ position: 'relative', height: 280 }}>
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
                background: `linear-gradient(135deg, ${theme.accent}60, ${theme.accent}20)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 60, color: theme.accent, fontWeight: 700 }}>
                  {article.category[0].toUpperCase()}
                </span>
              </div>
            )}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)',
            }} />
            {/* Top bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px',
            }}>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer',
                  borderRadius: '50%', width: 38, height: 38,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <ArrowLeft size={20} color="#fff" />
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleShare}
                  style={{
                    background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer',
                    borderRadius: '50%', width: 38, height: 38,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Share2 size={18} color="#fff" />
                </button>
                <button
                  onClick={() => toggleSaveArticle(article.id)}
                  style={{
                    background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer',
                    borderRadius: '50%', width: 38, height: 38,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {isSaved ? <BookmarkCheck size={18} color="#fff" fill="#fff" /> : <Bookmark size={18} color="#fff" />}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{
            padding: '24px 20px 40px',
            background: theme.cardBackground,
            borderRadius: '24px 24px 0 0',
            marginTop: -24,
            position: 'relative',
          }}>
            {/* Pull indicator */}
            <div style={{
              width: 40, height: 4, borderRadius: 2,
              background: theme.textLight,
              margin: '0 auto 20px',
            }} />

            {/* Category & metadata */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: theme.accent,
                background: `${theme.accent}18`, borderRadius: 8, padding: '4px 12px',
                textTransform: 'uppercase', letterSpacing: 0.8,
              }}>
                {article.category}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} color={theme.textSecondary} />
                <span style={{ fontSize: 12, color: theme.textSecondary }}>{article.readingTime} min read</span>
              </div>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: preferences.fontSize + 6,
              fontWeight: 700, color: theme.textPrimary,
              lineHeight: 1.3, margin: '0 0 12px',
              fontFamily: 'Inter, sans-serif',
            }}>
              {article.title}
            </h1>

            {/* Author & source */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
              paddingBottom: 20, borderBottom: `1px solid ${theme.border}`,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}80)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 16,
              }}>
                {(article.author || article.source)[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>
                  {article.author || 'Unknown Author'}
                </div>
                <div style={{ fontSize: 12, color: theme.textSecondary }}>
                  {article.source} • {timeAgo(article.publishedAt)}
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: preferences.fontSize,
              color: theme.textPrimary,
              lineHeight: 1.7,
              fontWeight: 500,
              margin: '0 0 20px',
              fontFamily: 'Inter, sans-serif',
            }}>
              {article.description}
            </p>

            {/* Content */}
            <div style={{
              fontSize: preferences.fontSize,
              color: theme.textPrimary,
              lineHeight: 1.8,
              fontFamily: 'Inter, sans-serif',
            }}>
              {article.content.split('\n\n').map((para, i) => (
                <p key={i} style={{ margin: '0 0 18px' }}>{para}</p>
              ))}
            </div>

            {/* Keywords */}
            {article.keywords.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Keywords
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {article.keywords.map((kw) => (
                    <span key={kw} style={{
                      fontSize: 12, color: theme.accent, fontWeight: 500,
                      background: `${theme.accent}12`, borderRadius: 20, padding: '5px 14px',
                    }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{
              display: 'flex', gap: 12, marginTop: 28, paddingTop: 20,
              borderTop: `1px solid ${theme.border}`,
            }}>
              <button
                onClick={() => isRead ? markAsUnread(article.id) : markAsRead(article.id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 16px', borderRadius: 12,
                  background: `${theme.textSecondary}15`,
                  border: 'none', cursor: 'pointer',
                  color: theme.textSecondary, fontSize: 13, fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                {isRead ? 'Mark Unread' : 'Mark Read'}
              </button>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 16px', borderRadius: 12,
                  background: theme.accent,
                  border: 'none', cursor: 'pointer',
                  color: '#fff', fontSize: 13, fontWeight: 600,
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <ExternalLink size={16} />
                Read Full Article
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
