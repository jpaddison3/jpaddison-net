import Head from 'next/head'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Nav from 'components/Nav'
import routes from 'lib/routes'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
    navOffset: theme.mixins.toolbar
}))

type LayoutProps = {
    pageTitle: string|React.ElementType
}

export const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
    const classes = useStyles()
    return <>
        <Head>
            <title>JP Addison's personal site</title>
            <link rel="icon" href="/favicon.ico" />
            {/* Favicon is from Noto Emoji - copyright google, licensed under Apache 2.0 */}
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        </Head>
        <Nav routes={routes} />
        <div className={classes.navOffset} />
        <Container fixed>
            <Typography variant='h2' component='h1' color='primary'>{pageTitle}</Typography>
            {children}
        </Container>
    </>
}

export default Layout