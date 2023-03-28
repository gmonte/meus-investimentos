import {
  FormEventHandler,
  PropsWithChildren,
  useCallback
} from 'react'

import clsx from 'clsx'

export interface FormProps extends PropsWithChildren {
  onSubmit: FormEventHandler<HTMLFormElement>
  className?: string
}

export function Form({
  onSubmit,
  className,
  children
}: FormProps) {
  const onFormSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault()
      onSubmit(event)
    },
    [onSubmit]
  )

  return (
    <form
      onSubmit={ onFormSubmit }
      className={ clsx('flex flex-col gap-3', className) }
    >
      {children}
    </form>
  )
}
