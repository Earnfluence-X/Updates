import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { Article } from '../types/news.types';
import { useTheme } from '../theme/ThemeContext';
import { useNewsStore } from '../store/newsStore';
import { timeAgo } from '../utils/timeAgo';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedCarouselProps {
  articles: Article[];
  onArticlePress: (article: Article) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ articles, onArticlePress }) => {
  const { theme } = useTheme();
  const { toggleSaveArticle, savedArticles } = useNewsStore();
  const [current, setCurrent] = useState(0);
  const featured = articles.slice(0, 5);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [featured.length]);

  const goTo = (index: number) => {
    setCurrent(index);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 5000);
  };

  if (featured.length === 0) return null;

  const article = featured[current];
  const isSaved = savedArticles.includes(article.id);

  return (
    <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', margin: '0 0 4px 0' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => onArticlePress(article)}
          style={{
            position: 'relative',
            height: 220,
            cursor: 'pointer',
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          <img
            src={article.imageUrl}
            alt={article.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
          }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 16px' }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#fff',
              background: theme.accent, borderRadius: 8, padding: '3px 10px',
              textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, display: 'inline-block',
            }}>
              Featured • {article.category}
            </span>
            <h2 style={{
              fontSize: 18, fontWeight: 700, color: '#fff', margin: '8px 0 0',
              lineHeight: 1.3,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {article.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                {article.source}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>•</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{timeAgo(article.publishedAt)}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={11} color="rgba(255,255,255,0.6)" />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{article.readingTime} min read</span>
              </span>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); toggleSaveArticle(article.id); }}
            style={{
              position: 'absolute', top: 14, right: 14,
              background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer',
              borderRadius: '50%', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            {isSaved ? <BookmarkCheck size={18} color="#fff" fill="#fff" /> : <Bookmark size={18} color="#fff" />}
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); goTo((current - 1 + featured.length) % featured.length); }}
        style={{
          position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer',
          borderRadius: '50%', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}
      >
        <ChevronLeft size={18} color="#fff" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goTo((current + 1) % featured.length); }}
        style={{
          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer',
          borderRadius: '50%', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}
      >
        <ChevronRight size={18} color="#fff" />
      </button>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 6,
      }}>
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); goTo(i); }}
            style={{
              width: i === current ? 20 : 6, height: 6,
              borderRadius: 3,
              background: i === current ? '#fff' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};
