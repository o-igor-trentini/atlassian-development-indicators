import type { AppProps } from 'next/app';
import { FC } from 'react';
import Head from 'next/head';
import { AppTheme, ConfigProvider } from '@adi/react-components';
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
                },
            }}
            locale="ptBR"
        >
            <GlobalStyle />

            <Head>
                <title>ADI - Indicadores de Dev </title>
            </Head>

            <Component {...pageProps} />
        </ConfigProvider>
    );
};

export default App;
