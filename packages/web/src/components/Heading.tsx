import {
  forwardRef,
  PropsWithChildren
} from 'react'

import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'

export type HeadingProps = PropsWithChildren & {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  asChild?: boolean
  className?: string
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({
    size = 'md',
    children,
    asChild,
    className
  }, ref) => {
    const Comp = asChild ? Slot : 'h2'

    return (
      <Comp
        ref={ ref }
        className={ clsx(
          'text-gray-100 font-sans',
          {
            'text-lg': size === 'sm',
            'text-xl': size === 'md',
            'text-2xl': size === 'lg',
            'text-3xl': size === 'xl'
          },
          className
        ) }
      >
        {children}
      </Comp>
    )
  }
)

Heading.displayName = 'Heading'
