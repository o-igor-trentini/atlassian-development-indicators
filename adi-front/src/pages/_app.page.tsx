import type { AppProps } from 'next/app';
import { useLayoutEffect, useState } from 'react';
import Head from 'next/head';
import { GlobalStyle } from '@/styles/global';
import { darkTheme, defaultTheme, ThemeType, ThemeVariant } from '@/styles/themes';
import { ThemeProvider } from 'styled-components';
import { LayoutWrapper } from '@/pages/components/LayoutWrapper';
import { NextPage } from 'next';
import { AppTheme, ConfigProvider, ThemeAlgorithm } from '@adi/react-components';

const { defaultAlgorithm, darkAlgorithm } = AppTheme;

const App: NextPage<AppProps> = ({ Component, pageProps }): JSX.Element => {
    // TODO: Adicionar favicon dinâmicamente

    const [theme, setTheme] = useState<ThemeType>(defaultTheme);

    const algorithm: Record<ThemeVariant, ThemeAlgorithm> = {
        light: defaultAlgorithm,
        dark: darkAlgorithm,
    };

    const handleMenuClick = (): void => {
        setTheme((state) => {
            if (state.variant === 'light') {
                localStorage.setItem('@adi/theme', 'dark');
                return darkTheme;
            }

            localStorage.setItem('@adi/theme', 'light');
            return defaultTheme;
        });
    };

    useLayoutEffect(() => {
        const storedTheme = localStorage.getItem('@adi/theme');

        setTheme(storedTheme === 'light' ? defaultTheme : darkTheme);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />

            <Head>
                <title>ADI - Indicadores de Dev </title>
            </Head>

            <ConfigProvider
                theme={{
                    algorithm: algorithm[theme.variant],
                    token: { ...theme },
                }}
                locale="ptBR"
            >
                <LayoutWrapper onSwitchTheme={handleMenuClick}>
                    <Component {...pageProps} />
                </LayoutWrapper>
            </ConfigProvider>
        </ThemeProvider>
    );
};

export default App;
