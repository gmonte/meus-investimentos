import clsx from 'clsx'

import {
  Button,
  ButtonProps
} from '../Button'

export interface ButtonsGroupItemProps extends ButtonProps {
  active: boolean
}

export function Item({
  className,
  active,
  ...props
}: ButtonsGroupItemProps) {
  return (
    <Button
      { ...props }
      className={ clsx(
        'flex-1',
        {
          'bg-cyan-900': !active,
          'hover:bg-cyan-800': !active
        },
        className
      ) }
    />
  )
}

Item.displayName = 'ButtonsGroup.Item'
