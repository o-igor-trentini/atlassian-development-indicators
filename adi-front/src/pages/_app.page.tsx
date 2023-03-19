import type { AppProps } from 'next/app';
import { FC } from 'react';
import Head from 'next/head';
import { ConfigProvider } from '../../../adi-front-design-system/packages/react-components';

const App: FC<AppProps> = ({ Component, pageProps }): JSX.Element => {
    // TODO: Adicionar favicon dinâmicamente

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: 'red',
                    borderRadius: 6,
                },
            }}
            locale="ptBR"
        >
            {/*<GlobalStyle />*/}

            <Head>
                <title>ADI - Indicadores de Dev </title>
            </Head>

            <Component {...pageProps} />
        </ConfigProvider>
    );
};

export default App;
