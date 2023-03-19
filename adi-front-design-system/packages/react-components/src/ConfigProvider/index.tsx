import type { FC, ReactNode } from 'react';
import { ConfigProvider as AntdConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';

export interface ConfigProviderProps {
    children: ReactNode;
    theme: ThemeConfig;
}

export const ConfigProvider: FC<ConfigProviderProps> = ({ children, theme }): JSX.Element => {
    return <AntdConfigProvider theme={theme}>{children}</AntdConfigProvider>;
};
