import { PropsWithChildren } from 'react'

export interface ButtonsGroupRootProps extends PropsWithChildren { }

export function Root({ children }: ButtonsGroupRootProps) {
  return (
    <div className="flex w-full gap-1">
      {children}
    </div>
  )
}

Root.displayName = 'ButtonsGroup.Root'
