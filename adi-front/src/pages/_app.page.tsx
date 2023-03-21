import type { AppProps } from 'next/app';
import { FC } from 'react';
import Head from 'next/head';
import { AppTheme, Col, ConfigProvider, Row } from '@adi/react-components';
import { GlobalStyle } from '@/styles/global';

const { defaultAlgorithm } = AppTheme;

const App: FC<AppProps> = ({ Component, pageProps }): JSX.Element => {
    // TODO: Adicionar favicon dinâmicamente

    return (
        <ConfigProvider
            theme={{
                algorithm: defaultAlgorithm,
                token: {
                    colorPrimary: '#00FF00',
                    borderRadius: 6,
                    padding: 12,
                },
            }}
            locale="ptBR"
        >
            <GlobalStyle />

            <Head>
                <title>ADI - Indicadores de Dev </title>
            </Head>

            <Row justify="center" align="top" style={{ minHeight: '100vh', backgroundColor: 'gray' }}>
                <Col xs={23} md={20} xl={18} style={{ padding: '1rem', backgroundColor: 'lightgray' }}>
                    <Component {...pageProps} />
                </Col>
            </Row>
        </ConfigProvider>
    );
};

export default App;
