import {
  ButtonHTMLAttributes,
  ReactNode
} from 'react'

import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  className?: string
}

export function Button({
  asChild,
  startIcon,
  endIcon,
  className,
  children,
  ...rest
}: ButtonProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <button
      { ...rest }
      className={ clsx(
        'py-2',
        'px-4',
        'rounded',
        'font-sans',
        'font-semibold',
        'text-sm',
        'text-black',
        'bg-cyan-500',
        'hover:bg-cyan-300',
        'active:bg-cyan-600',
        'focus:ring-2',
        'ring-white',
        'transition-colors',
        'flex',
        'items-center',
        className
      ) }
    >
      {startIcon && (
        <div className="px-2">
          {startIcon}
        </div>
      )}
      <Comp className="flex-1 text-center">
        {children}
      </Comp>
      {endIcon && (
        <div className="px-2">
          {endIcon}
        </div>
      )}
    </button>
  )
}
