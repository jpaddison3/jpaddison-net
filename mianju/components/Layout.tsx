import Head from 'next/head'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Nav from 'components/Nav'
import routes from 'lib/routes'

export const Layout: React.FC<{children: any}> = ({ children }) => {
  return <>
    <Head>
      <title>JP Addison's personal site</title>
      <link rel="icon" href="/favicon.ico" />
      {/* Favicon is from Noto Emoji - copyright google, licensed under Apache 2.0 */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </Head>
    <Container fixed>
      <Nav routes={routes} />
      {children}
    </Container>
  </>
}

export default Layout
