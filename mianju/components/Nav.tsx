import { useState } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SwipeableDrawer, { SwipeableDrawerProps } from '@material-ui/core/SwipeableDrawer'
import { makeStyles, Theme } from '@material-ui/core'
import { NavRoutes } from 'lib/routes'
import WrappedLink from 'components/WrappedLink'

const useStyles = makeStyles<Theme>(theme => ({
  drawerRoot: {
    minWidth: 125
  },
  menuButton: {
    marginTop: 12
  },
  navItem: {
    color: theme.palette.primary.dark
  }
}))

interface NavProps {
  routes: NavRoutes
}

interface NavDrawerProps extends SwipeableDrawerProps {
  routes: NavRoutes
}

const NavDrawer = ({ routes, open, onClose, onOpen }: NavDrawerProps) => {
  const classes = useStyles()

  return <SwipeableDrawer open={open} onClose={onClose} onOpen={onOpen}>
    <List className={classes.drawerRoot}>
      {routes.map(({ id, href, label }) => <ListItem key={id}>
        <ListItemText primaryTypographyProps={{variant: 'body2'}}>
          <WrappedLink className={classes.navItem} href={href}>{label}</WrappedLink>
        </ListItemText>
      </ListItem>)}
    </List>
  </SwipeableDrawer>
}

export default function Nav({ routes }: NavProps) {
  const classes = useStyles()
  const [showNavDrawer, setShowNavDrawer] = useState(false)

  return <>
    <div className={classes.menuButton}>
      <IconButton
        color='inherit'
        aria-label='menu'
        onClick={() => setShowNavDrawer(!showNavDrawer)}
        edge='start'
      >
        <MenuIcon />
      </IconButton>
    </div>
    <NavDrawer
      routes={routes}
      open={showNavDrawer}
      onClose={() => setShowNavDrawer(false)}
      onOpen={() => setShowNavDrawer(true)}
    />
  </>
}
