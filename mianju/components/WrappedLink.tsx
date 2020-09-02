/*
 * Make MUI and Next links play nicely with each other
 */
import React, { ReactNode, Ref } from 'react'
import Link, { LinkProps } from '@material-ui/core/Link'
import RouterLink from 'next/link'

// Props `href` and `children` should never be null, but the type signiture of
// MUI allows them to be, and we should follow their lead here if we want to
// pass WrappedLink into Mui's Link
type WrappedLinkProps = {
    className?: string,
    href?: string,
    as?: string,
    children?: ReactNode,
    prefetch?: boolean,
}

const WrappedLink = React.forwardRef(({ className, href, as, children, prefetch }: WrappedLinkProps, ref) => {
    if (!href) {
        throw new Error("Wrapped link must receive href")
    }
    return <RouterLink href={href} as={as} prefetch={prefetch} ref={ref}>
        <a className={className}>
            {children}
        </a>
    </RouterLink>
})

const _Link = React.forwardRef((props: LinkProps, ref: Ref<HTMLAnchorElement>) => {
    return <Link component={WrappedLink} ref={ref} {...props} />
})

export default _Link
