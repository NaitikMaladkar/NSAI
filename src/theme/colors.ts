/**
 * NerveSynapse — Color palette + theme tokens
 * ChatGPT-inspired dark theme as default, with a clean light variant.
 * Brand: Indigo (#6366F1) + Violet (#8B5CF6).
 */

export const Brand = {
  indigo: '#6366F1',
  violet: '#8B5CF6',
  indigoSoft: '#818CF8',
  violetSoft: '#A78BFA',
};

export type Theme = {
  mode: 'light' | 'dark';
  background: string;
  sidebar: string;
  sidebarActive: string;
  chatArea: string;
  userBubble: string;
  userBubbleText: string;
  assistantBubble: string;
  assistantBubbleText: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  divider: string;
  inputBg: string;
  inputBorder: string;
  accent: string;
  accentSoft: string;
  accentGradientEnd: string;
  success: string;
  warning: string;
  danger: string;
};

export const DarkTheme: Theme = {
  mode: 'dark',
  // Surfaces
  background: '#0F0F14',
  sidebar: '#17171F',
  sidebarActive: '#262633',
  chatArea: '#0F0F14',
  userBubble: Brand.indigo,
  userBubbleText: '#FFFFFF',
  assistantBubble: '#1E1E27',
  assistantBubbleText: '#ECECF1',
  // Text
  textPrimary: '#ECECF1',
  textSecondary: '#A0A0B0',
  textMuted: '#6B6B7B',
  // Borders / lines
  border: '#2A2A36',
  divider: '#22222B',
  // Inputs
  inputBg: '#1F1F2A',
  inputBorder: '#2F2F3D',
  // Brand
  accent: Brand.indigo,
  accentSoft: Brand.indigoSoft,
  accentGradientEnd: Brand.violet,
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export const LightTheme: Theme = {
  mode: 'light',
  background: '#FFFFFF',
  sidebar: '#F9F9FB',
  sidebarActive: '#ECEEF5',
  chatArea: '#FFFFFF',
  userBubble: Brand.indigo,
  userBubbleText: '#FFFFFF',
  assistantBubble: '#F1F2F6',
  assistantBubbleText: '#1A1A2E',
  textPrimary: '#1A1A2E',
  textSecondary: '#5B5B6B',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  divider: '#F0F0F4',
  inputBg: '#F9FAFB',
  inputBorder: '#D1D5DB',
  accent: Brand.indigo,
  accentSoft: Brand.indigoSoft,
  accentGradientEnd: Brand.violet,
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
};

export const themes: Record<'light' | 'dark', Theme> = {
  dark: DarkTheme,
  light: LightTheme,
};
