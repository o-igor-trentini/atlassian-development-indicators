export type ThemeVariant = 'light' | 'dark';

export interface ThemeType {
    theme: ThemeVariant;

    colorPrimary: string;

    ADIcolorSecondary: string;
    ADIcolorWhite: string;
    ADIcolorBlack: string;
    ADIcolorCreated: string;
    ADIcolorResolved: string;
    ADIcolorPending: string;

    borderRadius: number;

    padding: number;
}

export const defaultTheme: ThemeType = {
    theme: 'light',

    colorPrimary: '#00FF00',

    ADIcolorSecondary: '#020039',
    ADIcolorWhite: '#FFFFFF',
    ADIcolorBlack: '#000000',
    ADIcolorCreated: '#FF0000',
    ADIcolorResolved: '#32CD32',
    ADIcolorPending: '#0077B6',

    borderRadius: 6,

    padding: 12,
};
