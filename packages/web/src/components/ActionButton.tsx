import { ButtonHTMLAttributes } from 'react'

import { cva } from 'class-variance-authority'

import { cn } from '~/utils/cn'

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const style = cva(['flex items-center justify-center rounded-lg p-1 text-lg transition-colors'], {
  variants: {
    disabled: {
      true: 'text-gray-500',
      false: 'text-white hover:bg-gray-200/10 active:bg-gray-200/20'
    }
  },
  defaultVariants: { disabled: false }
})

export function ActionButton({
  children,
  className,
  disabled,
  ...rest
}: ActionButtonProps) {
  return (
    <button
      disabled={ disabled }
      className={ cn(style({ disabled }), className) }
      { ...rest }
    >
      {children}
    </button>
  )
}
