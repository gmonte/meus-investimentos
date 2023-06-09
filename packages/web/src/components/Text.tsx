import {
  forwardRef,
  PropsWithChildren
} from 'react'

import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'

export interface TextProps extends PropsWithChildren {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  asChild?: boolean
  className?: string
}

export const Text = forwardRef<HTMLHeadingElement, TextProps>(
  ({
    size = 'md',
    children,
    asChild,
    className
  }, ref) => {
    const Comp = asChild ? Slot : 'span'

    return (
      <Comp
        ref={ ref }
        className={ clsx(
          'font-sans',
          {
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-md': size === 'lg',
            'text-lg': size === 'xl'
          },
          className
        ) }
      >
        {children}
      </Comp>
    )
  }
)

Text.displayName = 'Text'
