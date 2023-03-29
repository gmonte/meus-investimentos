import {
  forwardRef,
  InputHTMLAttributes
} from 'react'

import clsx from 'clsx'

export interface TextInputInputProps extends InputHTMLAttributes<HTMLInputElement> { }

export const Input = forwardRef<HTMLInputElement, TextInputInputProps>(
  ({
    className,
    ...rest
  }, ref) => {
    return (
      <input
        ref={ ref }
        className={ clsx(
          'bg-transparent',
          'flex-1',
          'text-sm',
          'text-gray-100',
          'placeholder:text-gray-400',
          'outline-none',
          'h-8',
          className
        ) }
        { ...rest }
      />
    )
  }
)

Input.displayName = 'TextInput.Input'
