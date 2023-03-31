import { PropsWithChildren } from 'react'

import clsx from 'clsx'

import { Text } from '../Text'

export interface TextInputRootProps extends PropsWithChildren {
  className?: string
  error?: string
  label?: string
}

export function Root({
  className,
  error,
  label,
  children
}: TextInputRootProps) {
  return (
    <div className={ className }>
      {!!label && (
        <div className="mb-1">
          <Text className="font-semibold text-gray-300">
            {label}
          </Text>
        </div>
      )}

      <div
        className={ clsx(
          'flex',
          'items-center',
          'gap-3',
          'py-3',
          'px-3',
          'rounded',
          'font-sans',
          'text-xs',
          'bg-gray-800',
          'focus-within:ring-2',
          'ring-cyan-300',
          'transition-colors',
          'w-full',
          { 'ring-red-300 ring-2': !!error }
        ) }
      >
        {children}
      </div>
      {!!error && (
        <span className="text-red-300 text-xs">
          {error}
        </span>
      )}
    </div>
  )
}

Root.displayName = 'TextInput.Root'
