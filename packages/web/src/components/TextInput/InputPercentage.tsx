import { forwardRef } from 'react'
import CurrencyInput from 'react-currency-input-field'

import { Percent } from 'phosphor-react'

import { Icon } from './Icon'
import {
  Input,
  TextInputInputProps
} from './Input'

export interface TextInputInputPercentageProps extends Omit<TextInputInputProps, 'onChange'> {
  onChange: (value?: string) => void
}

export const InputPercentage = forwardRef<HTMLInputElement, TextInputInputPercentageProps>(
  ({
    onChange,
    ...props
  }, ref) => (
    <>
      {/* @ts-expect-error */}
      <CurrencyInput
        ref={ ref }
        customInput={ Input }
        decimalsLimit={ 3 }
        onValueChange={ onChange }
        placeholder="0,00"
        { ...props }
      />
      <Icon>
        <Percent fontSize={ 24 } />
      </Icon>
    </>
  )
)

InputPercentage.displayName = 'TextInput.InputPercentage'
