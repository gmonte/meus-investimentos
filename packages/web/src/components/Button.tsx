import {
  ButtonHTMLAttributes,
  ReactNode
} from 'react'

import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'
import { CircleNotch } from 'phosphor-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  className?: string
  loading?: boolean
  loadingClassName?: string
}

export function Button({
  asChild,
  startIcon,
  endIcon,
  className,
  children,
  loading,
  loadingClassName,
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

      {loading && (
        <CircleNotch
          weight="bold"
          className={ clsx('animate-spin text-black mr-2', loadingClassName) }
          size={ 20 }
        />
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
