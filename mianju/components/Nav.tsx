import {useState} from 'react'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SwipeableDrawer, { SwipeableDrawerProps } from '@material-ui/core/SwipeableDrawer'
import { makeStyles } from '@material-ui/core'
// import Logo from '../Logo'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  desktopNavigation: {
    flexGrow: 1
  },
  logoWrapper: {
    flexGrow: 1
  },
  logo: {
    height: 40,
    marginRight: theme.spacing(4)
  },
  [theme.breakpoints.up('md')]: {
    logoWrapper: {
      flexGrow: 0
    }
  }
}))

export type Route = {
  id: string,
  href: string,
  label: string,
  childRoutes?: Array<Route>
}

export type INavRoutes = Array<Route>

export interface NavProps {
  routes: INavRoutes
}

interface TNavDrawerProps extends SwipeableDrawerProps {
  routes: INavRoutes
}

const NavDrawer = ({ routes, open, onClose, onOpen }: TNavDrawerProps) => {
  return <SwipeableDrawer open={open} onClose={onClose} onOpen={() => {}}>
    <List>
      {routes.map(({ id, href, label}) => <ListItem button key={id}>
        <ListItemText>{label}</ListItemText>
      </ListItem>)}
    </List>
  </SwipeableDrawer>
}

export default function Nav({ routes }: NavProps) {
  const classes = useStyles()
  const [showNavDrawer, setShowNavDrawer] = useState(false)

  return <div className={classes.root}>
    <AppBar position='fixed'>
      <Container fixed>
        <Toolbar disableGutters>
          {/* <div className={classes.logoWrapper}>
            <Logo className={classes.logo} />
          </div> */}
          <Hidden smDown>
            <div className={classes.desktopNavigation}>
              {routes.map(route => <Button key={route.id} color='inherit' href={route.href}>{route.label}</Button>)}
            </div>
          </Hidden>
          <Hidden mdUp>
            <IconButton color='inherit' aria-label='menu' onClick={() => setShowNavDrawer(!showNavDrawer)}>
              <MenuIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
      </Container>
    </AppBar>
    <NavDrawer routes={routes} open={showNavDrawer} onClose={() => setShowNavDrawer(false)} onOpen={() => setShowNavDrawer(true)} />
  </div>
}
