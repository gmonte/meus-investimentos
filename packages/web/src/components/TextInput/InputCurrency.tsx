import { forwardRef } from 'react'
import CurrencyInput from 'react-currency-input-field'

import {
  Input,
  TextInputInputProps
} from './Input'

export interface TextInputInputCurrencyProps extends Omit<TextInputInputProps, 'onChange'> {
  onChange: (value?: string) => void
}

export const InputCurrency = forwardRef<HTMLInputElement, TextInputInputCurrencyProps>(
  ({
    onChange,
    ...props
  }, ref) => (
    <>
      {/* @ts-expect-error */}
      <CurrencyInput
        ref={ ref }
        customInput={ Input }
        intlConfig={ {
          locale: 'pt-BR',
          currency: 'BRL'
        } }
        onValueChange={ onChange }
        placeholder="R$ 0,00"
        { ...props }
      />
    </>
  )
)

InputCurrency.displayName = 'TextInput.InputCurrency'
