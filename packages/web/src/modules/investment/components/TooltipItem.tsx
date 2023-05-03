import { PropsWithChildren } from 'react'

import clsx from 'clsx'

import { Text } from '~/components/Text'

export interface TooltipItemProps extends PropsWithChildren {
  color: string
  label: string
  className?: string
}

export function TooltipItem({
  color,
  label,
  children,
  className
}: TooltipItemProps) {
  return (
    <div className={ clsx('flex items-center p-3', className) }>
      <span
        className="apexcharts-tooltip-marker"
        style={ { backgroundColor: color } }
      />
      <div className="flex items-center gap-2">
        <Text>
          {label}:
        </Text>
        <div className="flex items-center gap-2 max-[600px]:flex-col max-[600px]:items-start">
          {children}
        </div>
      </div>
    </div>
  )
}
