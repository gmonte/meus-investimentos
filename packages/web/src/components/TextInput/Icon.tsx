import { PropsWithChildren } from 'react'

import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'

export interface TextInputIconProps extends PropsWithChildren { }

export function Icon({ children }: TextInputIconProps) {
  return (
    <Slot
      className={ clsx(
        'w-6',
        'h-6',
        'text-gray-400'
      ) }
    >
      {children}
    </Slot>
  )
}

Icon.displayName = 'TextInput.Icon'
