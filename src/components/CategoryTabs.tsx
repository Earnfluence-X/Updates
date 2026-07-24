import React, { useRef, useEffect } from 'react';
import {
  Newspaper, Cpu, Heart, FlaskConical, Briefcase, Trophy, Film, Megaphone, Globe,
} from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useNewsStore } from '../store/newsStore';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.FC<any>> = {
  Newspaper, Cpu, Heart, FlaskConical, Briefcase, Trophy, Film, Megaphone, Globe,
};

export const CategoryTabs: React.FC = () => {
  const { theme } = useTheme();
  const { categories, currentCategory, setCurrentCategory } = useNewsStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        (activeEl as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentCategory]);

  return (
    <div
      ref={scrollRef}
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {categories.map((cat) => {
        const isActive = cat.id === currentCategory;
        const IconComp = iconMap[cat.icon];
        return (
          <motion.button
            key={cat.id}
            data-active={isActive}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentCategory(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 24,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease',
              background: isActive ? theme.accent : `${theme.accent}12`,
              color: isActive ? '#fff' : theme.textSecondary,
              flexShrink: 0,
            }}
          >
            {IconComp && <IconComp size={14} />}
            {cat.name}
          </motion.button>
        );
      })}
    </div>
  );
};
