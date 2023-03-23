import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { AppTheme, ConfigProvider, ThemeAlgorithm } from '@adi/react-components';
import { GlobalStyle } from '@/styles/global';
import { darkTheme, defaultTheme, ThemeType, ThemeVariant } from '@/styles/themes';
import { ThemeProvider } from 'styled-components';
import { LayoutWrapper } from '@/pages/components/LayoutWrapper';
import { NextPage } from 'next';

const { defaultAlgorithm, darkAlgorithm } = AppTheme;

const App: NextPage<AppProps> = ({ Component, pageProps }): JSX.Element => {
    // TODO: Adicionar favicon dinâmicamente

    const [theme, setTheme] = useState<ThemeType>(defaultTheme);

    const algorithm: Record<ThemeVariant, ThemeAlgorithm> = {
        light: defaultAlgorithm,
        dark: darkAlgorithm,
    };

    const handleMenuClick = (): void => setTheme((state) => (state.variant === 'light' ? darkTheme : defaultTheme));

    useEffect(() => {
        setTheme(defaultTheme);
    }, []);

    return (
        <ThemeProvider theme={defaultTheme}>
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
                <LayoutWrapper onClick={handleMenuClick}>
                    <Component {...pageProps} />
                </LayoutWrapper>
            </ConfigProvider>
        </ThemeProvider>
    );
};

export default App;
