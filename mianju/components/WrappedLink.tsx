// https://gist.github.com/herr-vogel/0b5d4f3c28f08dc6cc4a2fd4f7b4a4df#gistcomment-3051542
import React from 'react'
import MUILink, { LinkProps as MUILinkProps } from '@material-ui/core/Link'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'

/**
 * We need to Omit from the MUI Button the {href} prop
 * as we have to handle routing with Next.js Router
 * so we block the possibility to specify an href.
 */

export type LinkProps = Omit<MUILinkProps, 'href' | 'classes'> &
  Pick<NextLinkProps, 'href' | 'as' | 'prefetch'>

const Link = React.forwardRef<LinkProps, any>(
  ({ href, as, prefetch, ...props }, ref) => (
    <NextLink href={href} as={as} prefetch={prefetch} passHref>
      {/* @ts-ignore */}
      <MUILink ref={ref} {...props} />
    </NextLink>
  )
)

Link.displayName = 'Link'

export default Link
