import { Html, Head, Main, NextScript } from 'next/document';
import { FC } from 'react';

const Document: FC = (): JSX.Element => {
    return (
        <Html lang="pt-BR">
            <Head />

            <body>
                <Main />

                <NextScript />
            </body>
        </Html>
    );
};

export default Document;
