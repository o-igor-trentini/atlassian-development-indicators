import type { FC, ReactNode } from 'react';
import { ConfigProvider as AntdConfigProvider, theme as AntdTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import ptBRLocale from 'antd/es/locale/pt_BR';
import enLocale from 'antd/es/locale/en_GB';
import { Locale } from 'antd/es/locale';

export const AppTheme = AntdTheme;
export type ThemeAlgorithm = typeof AntdTheme.defaultAlgorithm;

export type LocaleVariant = 'ptBR' | 'en';

export interface ConfigProviderProps {
    children: ReactNode;
    theme: ThemeConfig;
    locale: LocaleVariant;
}

export const ConfigProvider: FC<ConfigProviderProps> = ({ children, theme, locale = 'ptBR' }): JSX.Element => {
    const languages: Record<LocaleVariant, Locale> = {
        ptBR: ptBRLocale,
        en: enLocale,
    };

    return (
        <AntdConfigProvider theme={theme} locale={languages[locale]}>
            {children}
        </AntdConfigProvider>
    );
};
