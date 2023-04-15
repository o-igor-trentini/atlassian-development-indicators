import { ThemeType } from '@it-adi/react-components';

export const baseTheme: Omit<ThemeType, 'variant'> = {
    // antd
    colorPrimary: '#104535',
    colorBgLayout: '#F5F5F5',
    colorBgContainer: '#FFFFFF',
    borderRadius: 6,
    padding: 12,

    ADIcolorSecondary: '#3bba87',
    ADIcolorWhite: '#FFFFFF',
    ADIcolorBlack: '#000000',
    ADIcolorCreated: '#C80815',
    ADIcolorResolved: '#009E60',
    ADIcolorPending: '#0077B6',

    ADIHeaderHeight: '4rem',
};

export const defaultTheme: ThemeType = {
    ...baseTheme,

    variant: 'light',
};

export const darkTheme: ThemeType = {
    ...baseTheme,

    variant: 'dark',

    // antd
    colorBgLayout: '#121212',
    colorBgContainer: '#2D2D2D',
};
