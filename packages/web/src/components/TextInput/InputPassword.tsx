import {
  forwardRef,
  useState
} from 'react'

import {
  Eye,
  EyeClosed
} from 'phosphor-react'

import { Icon } from './Icon'
import {
  Input,
  TextInputInputProps
} from './Input'

export interface TextInputInputPasswordProps extends TextInputInputProps {}

export const InputPassword = forwardRef<HTMLInputElement, TextInputInputPasswordProps>(
  (props, ref) => {
    const [showPass, setShowPass] = useState(false)

    return (
      <>
        <Input
          ref={ ref }
          type={ showPass ? 'text' : 'password' }
          { ...props }
        />
        <Icon>
          <button type="button" onClick={ () => setShowPass(old => !old) }>
            {showPass ? <Eye fontSize={ 24 } /> : <EyeClosed fontSize={ 24 } />}
          </button>
        </Icon>
      </>
    )
  }
)

InputPassword.displayName = 'TextInput.InputPassword'
