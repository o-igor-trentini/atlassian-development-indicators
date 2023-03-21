import type { AppProps } from 'next/app';
import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { AppTheme, Col, ConfigProvider, Row, ThemeAlgorithm } from '@adi/react-components';
import { GlobalStyle } from '@/styles/global';
import { defaultTheme, ThemeType, ThemeVariant } from '@/styles/themes';
import { ThemeProvider } from 'styled-components';

const { defaultAlgorithm, darkAlgorithm } = AppTheme;

const App: FC<AppProps> = ({ Component, pageProps }): JSX.Element => {
    // TODO: Adicionar favicon dinâmicamente

    const [theme, setTheme] = useState<ThemeType>(defaultTheme);

    const algorithm: Record<ThemeVariant, ThemeAlgorithm> = {
        light: defaultAlgorithm,
        dark: darkAlgorithm,
    };

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
                    algorithm: algorithm[theme.theme],
                    token: {
                        ...defaultTheme,
                    },
                }}
                locale="ptBR"
            >
                <Row justify="center" align="top" style={{ minHeight: '100vh', backgroundColor: 'gray' }}>
                    <Col xs={23} md={20} xl={18} style={{ padding: '1rem', backgroundColor: 'lightgray' }}>
                        <Component {...pageProps} />
                    </Col>
                </Row>
            </ConfigProvider>
        </ThemeProvider>
    );
};

export default App;
