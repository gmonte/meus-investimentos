import {
  forwardRef,
  InputHTMLAttributes,
  PropsWithChildren,
  useState
} from 'react'

import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'
import {
  Eye,
  EyeClosed
} from 'phosphor-react'

export type TextInputRootProps = PropsWithChildren & {
  className?: string
  error?: string
}

function TextInputRoot({
  className,
  error,
  children
}: TextInputRootProps) {
  return (
    <div>
      <div
        className={ clsx(
          'flex',
          'items-center',
          'gap-3',
          'py-3',
          'px-3',
          'rounded',
          'font-sans',
          'text-xs',
          'bg-gray-800',
          'focus-within:ring-2',
          'ring-cyan-300',
          'transition-colors',
          { 'ring-red-300 ring-2': !!error },
          className
        ) }
      >
        {children}
      </div>
      {!!error && (
        <span className="text-red-300 text-xs">
          {error}
        </span>
      )}
    </div>
  )
}

TextInputRoot.displayName = 'TextInput.Root'

export type TextInputIconProps = PropsWithChildren

function TextInputIcon({ children }: TextInputInputProps) {
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

TextInputIcon.displayName = 'TextInput.Icon'

export type TextInputInputProps = InputHTMLAttributes<HTMLInputElement>

const TextInputInput = forwardRef<HTMLInputElement, TextInputInputProps>(
  ({
    className,
    ...rest
  }, ref) => {
    return (
      <input
        ref={ ref }
        className={ clsx(
          'bg-transparent',
          'flex-1',
          'text-sm',
          'text-gray-100',
          'placeholder:text-gray-400',
          'outline-none',
          'h-8',
          className
        ) }
        { ...rest }
      />
    )
  }
)

TextInputInput.displayName = 'TextInput.Input'

const TextInputInputPassword = forwardRef<HTMLInputElement, TextInputInputProps>(
  (props, ref) => {
    const [showPass, setShowPass] = useState(false)

    return (
      <>
        <TextInputInput
          ref={ ref }
          type={ showPass ? 'text' : 'password' }
          { ...props }
        />
        <TextInputIcon>
          <button type="button" onClick={ () => setShowPass(old => !old) }>
            {showPass ? <Eye fontSize={ 24 } /> : <EyeClosed fontSize={ 24 } />}
          </button>
        </TextInputIcon>
      </>
    )
  }
)

TextInputInputPassword.displayName = 'TextInput.InputPassword'

export const TextInput = {
  Root: TextInputRoot,
  Input: TextInputInput,
  InputPassword: TextInputInputPassword,
  Icon: TextInputIcon
}
