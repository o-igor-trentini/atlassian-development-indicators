export type ThemeVariant = 'light' | 'dark';

export interface ThemeType {
    variant: ThemeVariant;

    // antd
    colorPrimary: string;
    colorBgLayout: string;
    colorBgContainer: string;
    borderRadius: number;
    padding: number;

    ADIcolorSecondary: string;
    ADIcolorWhite: string;
    ADIcolorBlack: string;
    ADIcolorCreated: string;
    ADIcolorResolved: string;
    ADIcolorPending: string;

    ADIHeaderHeight: string;
}
