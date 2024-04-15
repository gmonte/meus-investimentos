import { PropsWithChildren } from 'react'

import clsx from 'clsx'
import { ArrowUp } from 'phosphor-react'

import {
  Text,
  TextProps
} from './Text'

export interface GrowthProps extends PropsWithChildren {
  className?: string
  size?: TextProps['size']
}

export function Growth({
  children,
  className,
  size = 'md'
}: GrowthProps) {
  return (
    <div
      className={ clsx(
        'border border-green-700 rounded-xl px-1 flex items-center',
        className
      ) }
      >
      <ArrowUp className="font-mono text-green-700" weight="bold" />
      <Text className="font-mono font-bold text-green-700" size={ size }>
        {children}
      </Text>
    </div>
  )
}
