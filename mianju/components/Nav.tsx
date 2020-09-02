import {useState} from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SwipeableDrawer, { SwipeableDrawerProps } from '@material-ui/core/SwipeableDrawer'
import { makeStyles } from '@material-ui/core'
import { NavRoutes } from 'lib/routes'

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginTop: 12
  }
}))

interface NavProps {
  routes: NavRoutes
}

interface NavDrawerProps extends SwipeableDrawerProps {
  routes: NavRoutes
}

// TODO;
const NavDrawer = ({ routes, open, onClose, onOpen }: NavDrawerProps) => {
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
    <NavDrawer routes={routes} open={showNavDrawer} onClose={() => setShowNavDrawer(false)} onOpen={() => setShowNavDrawer(true)} />
  </>
}
