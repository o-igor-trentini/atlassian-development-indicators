import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { darkTheme, defaultTheme } from '@/styles/themes';
import { LayoutWrapper } from '@/pages/components/LayoutWrapper';
import { NextPage } from 'next';
import { ConfigProvider, GlobalStyle, ThemeProvider, ThemeType } from '@it-adi/react-components';

const App: NextPage<AppProps> = ({ Component, pageProps }): JSX.Element => {
    // TODO: Adicionar favicon dinâmicamente

    const [theme, setTheme] = useState<ThemeType>(defaultTheme);

    const handleClickChangeTheme = (): void =>
        setTheme((state) => {
            if (state.variant === 'light') {
                localStorage.setItem('@it-adi/theme', 'dark');
                return darkTheme;
            }

            localStorage.setItem('@it-adi/theme', 'light');
            return defaultTheme;
        });

    useEffect(() => {
        const storedTheme = localStorage.getItem('@it-adi/theme');

        setTheme(storedTheme === 'light' ? defaultTheme : darkTheme);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle {...theme} />

            <Head>
                <title>ADI - Indicadores de Dev</title>
            </Head>

            <ConfigProvider theme={theme} locale="ptBR">
                <LayoutWrapper onSwitchTheme={handleClickChangeTheme}>
                    <Component {...pageProps} />
                </LayoutWrapper>
            </ConfigProvider>
        </ThemeProvider>
    );
};

export default App;
