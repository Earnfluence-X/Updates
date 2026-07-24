import React, { useState } from 'react';
import {
  ArrowLeft, Sun, Moon, Type, Bell, BellOff, Trash2, RotateCcw, Info,
  Check, ChevronRight, Eye, Minus, Plus,
} from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useNewsStore } from '../store/newsStore';
import { CATEGORIES } from '../data/mockData';
import { motion } from 'framer-motion';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const {
    preferences, toggleDarkMode, setFontSize, updatePreferences,
    toggleCategoryPreference, clearReadArticles, readArticles,
  } = useNewsStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    updatePreferences({
      categories: ['technology', 'health', 'science', 'business'],
      sources: [],
      topics: [],
      showReadArticles: true,
      notificationsEnabled: true,
      notificationSchedule: { hour: 7, minute: 0 },
      darkMode: false,
      fontSize: 16,
    });
    setShowResetConfirm(false);
  };

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{
        fontSize: 13, fontWeight: 700, color: theme.accent,
        margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1,
        fontFamily: 'Inter, sans-serif', padding: '0 4px',
      }}>
        {title}
      </h3>
      <div style={{
        background: theme.cardBackground, borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {children}
      </div>
    </div>
  );

  const SettingRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    description?: string;
    right?: React.ReactNode;
    onClick?: () => void;
    danger?: boolean;
  }> = ({ icon, label, description, right, onClick, danger }) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px',
        borderBottom: `1px solid ${theme.border}30`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.2s',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: danger ? `${theme.error}12` : `${theme.accent}12`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 500, color: danger ? theme.error : theme.textPrimary,
          fontFamily: 'Inter, sans-serif',
        }}>
          {label}
        </div>
        {description && (
          <div style={{
            fontSize: 12, color: theme.textSecondary, marginTop: 2,
            fontFamily: 'Inter, sans-serif',
          }}>
            {description}
          </div>
        )}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
      {onClick && !right && <ChevronRight size={16} color={theme.textLight} />}
    </div>
  );

  const Toggle: React.FC<{ value: boolean; onChange: () => void }> = ({ value, onChange }) => (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      style={{
        width: 48, height: 28, borderRadius: 14, border: 'none',
        cursor: 'pointer', padding: 2,
        background: value ? theme.accent : `${theme.textLight}40`,
        transition: 'background 0.3s',
        position: 'relative',
      }}
    >
      <motion.div
        animate={{ x: value ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: 24, height: 24, borderRadius: 12,
          background: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  );

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
        display: 'flex', alignItems: 'center', gap: 14,
        flexShrink: 0,
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          style={{
            background: `${theme.accent}12`, border: 'none', cursor: 'pointer',
            borderRadius: '50%', width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color={theme.accent} />
        </motion.button>
        <h1 style={{
          fontSize: 22, fontWeight: 700, color: theme.textPrimary,
          margin: 0, fontFamily: 'Inter, sans-serif',
        }}>
          Settings
        </h1>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        {/* Category Preferences */}
        <Section title="Category Preferences">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
            <SettingRow
              key={cat.id}
              icon={<Check size={16} color={preferences.categories.includes(cat.id) ? theme.accent : theme.textLight} />}
              label={cat.name}
              description={cat.description}
              onClick={() => toggleCategoryPreference(cat.id)}
              right={
                <Toggle
                  value={preferences.categories.includes(cat.id)}
                  onChange={() => toggleCategoryPreference(cat.id)}
                />
              }
            />
          ))}
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <SettingRow
            icon={preferences.darkMode ? <Moon size={16} color={theme.accent} /> : <Sun size={16} color={theme.accent} />}
            label="Dark Mode"
            description={preferences.darkMode ? 'Dark theme active' : 'Light theme active'}
            right={<Toggle value={preferences.darkMode} onChange={toggleDarkMode} />}
          />
          <SettingRow
            icon={<Type size={16} color={theme.accent} />}
            label="Font Size"
            description={`Current: ${preferences.fontSize}px`}
            right={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setFontSize(preferences.fontSize - 1); }}
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `${theme.accent}12`, border: 'none',
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Minus size={14} color={theme.accent} />
                </button>
                <span style={{
                  fontSize: 15, fontWeight: 600, color: theme.textPrimary,
                  width: 28, textAlign: 'center', fontFamily: 'Inter, sans-serif',
                }}>
                  {preferences.fontSize}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setFontSize(preferences.fontSize + 1); }}
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `${theme.accent}12`, border: 'none',
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Plus size={14} color={theme.accent} />
                </button>
              </div>
            }
          />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <SettingRow
            icon={preferences.notificationsEnabled ? <Bell size={16} color={theme.accent} /> : <BellOff size={16} color={theme.textLight} />}
            label="Push Notifications"
            description={preferences.notificationsEnabled ? 'Enabled' : 'Disabled'}
            right={
              <Toggle
                value={preferences.notificationsEnabled}
                onChange={() => updatePreferences({ notificationsEnabled: !preferences.notificationsEnabled })}
              />
            }
          />
          <SettingRow
            icon={<Eye size={16} color={theme.accent} />}
            label="Show Read Articles"
            description={preferences.showReadArticles ? 'Showing read articles' : 'Hiding read articles'}
            right={
              <Toggle
                value={preferences.showReadArticles}
                onChange={() => updatePreferences({ showReadArticles: !preferences.showReadArticles })}
              />
            }
          />
        </Section>

        {/* Data Management */}
        <Section title="Data Management">
          <SettingRow
            icon={<Trash2 size={16} color={theme.error} />}
            label="Clear Read History"
            description={`${readArticles.length} article${readArticles.length !== 1 ? 's' : ''} read`}
            onClick={() => { if (readArticles.length > 0) clearReadArticles(); }}
            danger
          />
          <SettingRow
            icon={<RotateCcw size={16} color={theme.error} />}
            label="Reset All Preferences"
            description="Restore default settings"
            onClick={() => setShowResetConfirm(true)}
            danger
          />
        </Section>

        {/* About */}
        <Section title="About">
          <SettingRow
            icon={<Info size={16} color={theme.accent} />}
            label="UPDATE News App"
            description="Version 1.0.0"
          />
        </Section>

        {/* Font Preview */}
        <div style={{
          background: theme.cardBackground, borderRadius: 16, padding: 20,
          marginBottom: 24,
        }}>
          <h4 style={{
            fontSize: 13, fontWeight: 700, color: theme.accent,
            margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1,
            fontFamily: 'Inter, sans-serif',
          }}>
            Font Preview
          </h4>
          <p style={{
            fontSize: preferences.fontSize, color: theme.textPrimary,
            lineHeight: 1.6, margin: 0, fontFamily: 'Inter, sans-serif',
          }}>
            This is a preview of how article text will appear with your current font size setting of {preferences.fontSize}px.
          </p>
        </div>
      </div>

      {/* Reset Confirm */}
      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowResetConfirm(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: theme.overlay,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
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
              background: `${theme.warning}12`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <RotateCcw size={24} color={theme.warning} />
            </div>
            <h3 style={{
              fontSize: 18, fontWeight: 700, color: theme.textPrimary,
              margin: '0 0 8px', fontFamily: 'Inter, sans-serif',
            }}>
              Reset Preferences?
            </h3>
            <p style={{
              fontSize: 14, color: theme.textSecondary, margin: '0 0 24px',
              lineHeight: 1.5, fontFamily: 'Inter, sans-serif',
            }}>
              All your settings will be restored to their default values. Saved articles will not be affected.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowResetConfirm(false)}
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
                onClick={handleReset}
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: 12,
                  background: theme.warning, border: 'none',
                  cursor: 'pointer', color: '#fff',
                  fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                }}
              >
                Reset
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
