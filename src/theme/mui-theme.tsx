import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';
import { radius } from './radius';

export const getMuiTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        light: colors.primary.light,
        main: colors.primary.main,
        dark: colors.primary.dark,
        contrastText: colors.primary.contrastText,
      },
      secondary: {
        light: colors.secondary.light,
        main: colors.secondary.main,
        dark: colors.secondary.dark,
        contrastText: colors.secondary.contrastText,
      },
      success: {
        light: colors.success.light,
        main: colors.success.main,
        dark: colors.success.dark,
        contrastText: colors.success.contrastText,
      },
      warning: {
        light: colors.warning.light,
        main: colors.warning.main,
        dark: colors.warning.dark,
        contrastText: colors.warning.contrastText,
      },
      error: {
        light: colors.danger.light,
        main: colors.danger.main,
        dark: colors.danger.dark,
        contrastText: colors.danger.contrastText,
      },
      background: {
        default: isDark ? colors.background.dark : colors.background.light,
        paper: isDark ? colors.background.paperDark : colors.background.paperLight,
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#475569',
        disabled: isDark ? '#475569' : '#cbd5e1',
      },
      divider: isDark ? colors.border.dark : colors.border.light,
    },
    typography: {
      fontFamily: typography.fontFamily,
      h1: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        lineHeight: typography.h1.lineHeight,
      },
      h2: {
        fontSize: typography.h2.fontSize,
        fontWeight: typography.h2.fontWeight,
        lineHeight: typography.h2.lineHeight,
      },
      h3: {
        fontSize: typography.h3.fontSize,
        fontWeight: typography.h3.fontWeight,
        lineHeight: typography.h3.lineHeight,
      },
      h4: {
        fontSize: typography.h4.fontSize,
        fontWeight: typography.h4.fontWeight,
        lineHeight: typography.h4.lineHeight,
      },
      body1: {
        fontSize: typography.body1.fontSize,
        fontWeight: typography.body1.fontWeight,
        lineHeight: typography.body1.lineHeight,
      },
      body2: {
        fontSize: typography.body2.fontSize,
        fontWeight: typography.body2.fontWeight,
        lineHeight: typography.body2.lineHeight,
      },
      caption: {
        fontSize: typography.caption.fontSize,
        fontWeight: typography.caption.fontWeight,
        lineHeight: typography.caption.lineHeight,
      },
      button: {
        fontSize: typography.button.fontSize,
        fontWeight: typography.button.fontWeight,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: parseFloat(radius.md) * 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            boxShadow: 'none',
            fontWeight: 600,
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: radius.xl,
            borderColor: isDark ? colors.border.dark : colors.border.light,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: radius.xxl,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });
};

export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      return 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [mode]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setMode(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const theme = React.useMemo(() => getMuiTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
