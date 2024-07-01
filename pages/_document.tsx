import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="ko">
                <Head>
                    <link rel="preconnect" href="https://cdn.jsdelivr.net" />
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@1.7.5/src/app/ci.min.css" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
