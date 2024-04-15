import { forwardRef } from 'react'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import clsx from 'clsx'

import { Text } from '../Text'

export interface RadioGroupProps extends Omit<RadioGroupPrimitive.RadioGroupProps, 'onChange'> {
  label?: string
  className?: string
  onChange: (value: string) => void
}

export const Group = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({
    label,
    className,
    onChange,
    ...props
  }, ref) => (
    <div className={ clsx('flex flex-col gap-3 flex-1', className) }>
      {label && (
        <Text className="font-semibold text-gray-300">
          {label}
        </Text>
      )}

      <RadioGroupPrimitive.Root
        ref={ ref }
        className="flex flex-1 flex-wrap gap-2"
        onValueChange={ onChange }
        { ...props }
      />
    </div>
  )
)

Group.displayName = 'Radio.Group'
