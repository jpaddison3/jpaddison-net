import Head from 'next/head'

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return <>
        <Head>
            <title>JP Addison's personal site</title>
            <link rel="icon" href="/favicon.ico" />
            {/* Favicon is from Noto Emoji - copyright google, licensed under Apache 2.0 */}
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        </Head>
        {children}
    </>
}
