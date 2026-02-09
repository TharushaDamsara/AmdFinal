export const COLORS = {
    primary: '#2E7D32', // Deep Forest Green
    primaryLight: '#4CAF50',
    primaryDark: '#1B5E20',
    secondary: '#81C784',
    background: '#F8F9FA',
    white: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    error: '#D32F2F',
    success: '#388E3C',
    surface: '#FFFFFF',
    border: '#E0E0E0',
    shadow: '#000000',
    accent: '#FFC107',
    glass: 'rgba(255, 255, 255, 0.8)',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
};

export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 30,
    full: 9999,
};

export const TYPOGRAPHY = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold' as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700' as const,
        lineHeight: 32,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: 'normal' as const,
        lineHeight: 24,
    },
    caption: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
};

export const SHADOWS = {
    light: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    medium: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    heavy: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
};
