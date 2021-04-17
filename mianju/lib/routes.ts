type Route = {
  id: string,
  href: string,
  label: string,
}

export type NavRoutes = Array<Route>

export const routes: NavRoutes = [
  {
    id: 'home',
    href: '/',
    label: 'Home'
  },
  // {
  //   id: 'guest-book',
  //   href: '/guest-book',
  //   label: 'Guest Book'
  // }
]

export default routes
