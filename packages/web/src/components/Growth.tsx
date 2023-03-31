import { PropsWithChildren } from 'react'

import clsx from 'clsx'
import { ArrowUp } from 'phosphor-react'

import { Text } from './Text'

export interface GrowthProps extends PropsWithChildren {
  className?: string
}

export function Growth({ children, className }: GrowthProps) {
  return (
    <div
      className={ clsx(
        'border border-green-700 rounded-xl px-1 flex items-center',
        className
      ) }
      >
      <ArrowUp className="text-green-700 font-mono" weight="bold" />
      <Text className="text-green-700 font-bold font-mono" size="md">
        {children}
      </Text>
    </div>
  )
}
