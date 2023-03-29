import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import clsx from 'clsx'

import { Text } from '../Text'
import { TextInput } from '../TextInput'

export interface RadioItemProps extends RadioGroupPrimitive.RadioGroupItemProps {
  label: string
}

export function Item({
  label,
  id,
  value,
  className,
  ...props
}: RadioItemProps) {
  return (
    <label htmlFor={ id ?? value } className={ className }>
      <TextInput.Root className="cursor-pointer">
        <div className="flex items-center gap-2">
          <RadioGroupPrimitive.Item
            id={ id ?? value }
            value={ value }
            className={ clsx(
              'peer relative w-4 h-4 rounded-full',
              // Setting the background in dark properly requires a workaround (see css/tailwind.css)
              'border border-transparent text-white',
              'radix-state-checked:bg-cyan-500',
              'radix-state-unchecked:bg-gray-100 dark:radix-state-unchecked:bg-gray-900',
              'focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring focus-visible:ring-cyan-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800'
            ) }
            { ...props }
          >
            <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center leading-0">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </RadioGroupPrimitive.Indicator>
          </RadioGroupPrimitive.Item>

          <Text
            className="font-medium text-gray-700 dark:text-gray-400 cursor-pointer"
          >
            {label}
          </Text>
        </div>
      </TextInput.Root>
    </label>
  )
}

Item.displayName = 'Radio.Item'
