import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { NextPage } from 'next';
import { ServerStyleSheet } from '@adi/react-components';

const MyDocument: NextPage = () => {
    MyDocument.getInitialProps = async (ctx: DocumentContext) => {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);

            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}

                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    };

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

export default MyDocument;
