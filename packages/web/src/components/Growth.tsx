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
      <ArrowUp className="text-green-700 font-mono" weight="bold" />
      <Text className="text-green-700 font-bold font-mono" size={ size }>
        {children}
      </Text>
    </div>
  )
}
