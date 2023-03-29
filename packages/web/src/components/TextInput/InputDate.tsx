import {
  forwardRef,
  MutableRefObject,
  useMemo
} from 'react'
import MaskedInput from 'react-text-mask'

import { CalendarBlank } from 'phosphor-react'

import { Icon } from './Icon'
import {
  Input,
  TextInputInputProps
} from './Input'

export interface TextInputInputDateProps extends TextInputInputProps { }

export const InputDate = forwardRef<HTMLInputElement, TextInputInputDateProps>(
  (props, ref) => {
    const mask = useMemo(
      () => [/[0-3]/, /\d/, '/', /[0-1]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      []
    )
    return (
      <>
        <MaskedInput
          // @ts-expect-error
          ref={ ref }
          mask={ mask }
          guide={ false }
          placeholder="dd/mm/aaaa"
          { ...props }
          render={ (textMaskRef, inputProps) => (
            <Input
              ref={ (node) => {
                if (node) {
                  textMaskRef(node)
                  if (ref) {
                    (ref as MutableRefObject<HTMLInputElement>).current = node
                  }
                }
              } }
              { ...inputProps }
            />
          ) }
        />

        <Icon>
          <CalendarBlank fontSize={ 24 } />
        </Icon>
      </>
    )
  }
)

InputDate.displayName = 'TextInput.InputDate'
