export type ThemeVariant = 'light' | 'dark';

export interface ThemeType {
    theme: ThemeVariant;

    colorPrimary: string;

    ADIcolorSecondary: string;
    ADIcolorWhite: string;
    ADIcolorBlack: string;

    borderRadius: number;

    padding: number;
}

export const defaultTheme: ThemeType = {
    theme: 'light',

    colorPrimary: '#00FF00',

    ADIcolorSecondary: '#020039',
    ADIcolorWhite: '#FFFFFF',
    ADIcolorBlack: '#000000',

    borderRadius: 6,

    padding: 12,
};
