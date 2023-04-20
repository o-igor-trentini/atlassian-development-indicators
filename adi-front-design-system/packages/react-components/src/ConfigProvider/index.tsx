import type { FC, ReactNode } from 'react';
import type { ThemeConfig } from 'antd';
import { ConfigProvider as AntdConfigProvider, theme as AntdTheme } from 'antd';
import ptBRLocale from 'antd/lib/locale/pt_BR';
import enLocale from 'antd/lib/locale/en_GB';
import { Locale } from 'antd/lib/locale';
import { ThemeType, ThemeVariant } from '../styles/theme';

export const AppTheme = AntdTheme;
const { defaultAlgorithm, darkAlgorithm } = AppTheme;

export type LocaleVariant = 'ptBR' | 'en';

export interface ConfigProviderProps {
    children: ReactNode;
    theme: ThemeType;
    locale: LocaleVariant;
}

export const ConfigProvider: FC<ConfigProviderProps> = ({ children, theme, locale = 'ptBR' }): JSX.Element => {
    const languages: Record<LocaleVariant, Locale> = {
        ptBR: ptBRLocale,
        en: enLocale,
    };

    const algorithm: Record<ThemeVariant, typeof defaultAlgorithm> = {
        light: defaultAlgorithm,
        dark: darkAlgorithm,
    };

    const themeConfig: ThemeConfig = {
        algorithm: algorithm[theme.variant],
        token: { ...theme },
    };

    return (
        <AntdConfigProvider theme={themeConfig} locale={languages[locale]}>
            {children}
        </AntdConfigProvider>
    );
};
