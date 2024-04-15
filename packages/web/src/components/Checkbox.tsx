import { forwardRef } from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { Check } from 'phosphor-react'

import { Text } from './Text'

export type CheckedState = CheckboxPrimitive.CheckedState

export interface CheckboxProps {
  label?: string
  checked?: CheckedState
  onChange?: (checked: CheckedState) => void
  className?: string
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({
    label,
    className,
    onChange,
    checked
  }, ref) => (
    <div className={ clsx('flex items-center gap-3', className) }>
      <CheckboxPrimitive.Root
        ref={ ref }
        className="flex size-6 rounded border  border-solid border-cyan-500 bg-gray-800 p-[2px]"
        onCheckedChange={ onChange }
        checked={ checked }
      >
        <CheckboxPrimitive.Indicator asChild>
          <Check weight="bold" className="size-5 text-cyan-500" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <div className="cursor-pointer" onClick={ () => onChange?.(!checked) } >
          <Text className="font-semibold">
            {label}
          </Text>
        </div>
      )}
    </div>
  )
)

Checkbox.displayName = 'Checkbox'
