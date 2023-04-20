import { FC, ReactNode } from 'react';
import { ConfigProvider, GlobalStyle, ThemeProvider } from '@it-adi/react-components';
import { ThemeType } from '@it-adi/react-components/src';

export interface ConfigProviderStoryProps {
    children: ReactNode;
}

export const ConfigProviderStory: FC<ConfigProviderStoryProps> = ({ children }): JSX.Element => {
    const theme: ThemeType = {
        variant: 'light',

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

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle {...theme} />

            <ConfigProvider locale="ptBR" theme={theme}>
                {children}
            </ConfigProvider>
        </ThemeProvider>
    );
};
