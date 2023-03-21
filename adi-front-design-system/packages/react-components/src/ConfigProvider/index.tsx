import type { FC, ReactNode } from 'react';
import { ConfigProvider as AntdConfigProvider, theme as AntdTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import ptBRLocale from 'antd/lib/locale/pt_BR';
import enLocale from 'antd/lib/locale/en_GB';

export const AppTheme = AntdTheme;
export type ThemeAlgorithm = typeof AntdTheme.defaultAlgorithm;

export interface ConfigProviderProps {
    children: ReactNode;
    theme: ThemeConfig;
    locale: 'ptBR' | 'en';
}

export const ConfigProvider: FC<ConfigProviderProps> = ({ children, theme, locale = 'ptBR' }): JSX.Element => {
    return (
        <AntdConfigProvider theme={theme} locale={locale === 'ptBR' ? ptBRLocale : enLocale}>
            {children}
        </AntdConfigProvider>
    );
};
