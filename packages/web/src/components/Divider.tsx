import { PropsWithChildren } from 'react'

import clsx from 'clsx'

import { Text } from './Text'

export interface DividerProps extends PropsWithChildren {
  className?: string
}

export function Divider({ children, className }: DividerProps) {
  return (
    <div className={ clsx(
      'flex items-center justify-center w-full my-3',
      className
    ) }>
      <div className="flex-1 h-[1px] bg-gray-500" />
      {children && (
        <Text className="px-2 text-gray-500">
          {children}
        </Text>
      )}
      <div className="flex-1 h-[1px] bg-gray-500" />
    </div>
  )
}
