import type { AppProps } from 'next/app';
import { FC } from 'react';

const App: FC<AppProps> = ({ Component, pageProps }): JSX.Element => {
    return <Component {...pageProps} />;
};

export default App;
