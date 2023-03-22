import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import flow from 'lodash/fp/flow'
import * as yup from 'yup'

import { ForgotPasswordData } from '~/@types/Auth'
import { Button } from '~/components/Button'
import { Form } from '~/components/Form'
import { Modal } from '~/components/Modal'
import { TextInput } from '~/components/TextInput'
import { ModalProps } from '~/hooks/useModal'
import { useToast } from '~/hooks/useToast'
import { useAppDispatch } from '~/store'
import { AuthActions } from '~/store/auth'
import { email } from '~/utils/validators/email.validator'
import { required } from '~/utils/validators/required.validator'

const schema = yup.object().shape<Record<keyof ForgotPasswordData, yup.AnySchema>>({
  email: flow(
    email(),
    required()
  )(yup.string())
})

export function ForgotPasswordModal ({ open, close }: ModalProps) {
  const dispatch = useAppDispatch()
  const { createToast } = useToast()

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<ForgotPasswordData>({ resolver: yupResolver(schema) })

  const handleForgotPassword = useCallback(
    (data: ForgotPasswordData) => {
      dispatch(AuthActions.forgotPassword({
        data,
        onSuccess () {
          createToast({
            type: 'success',
            title: 'Tudo certo!',
            description: 'Enviamos um email de recuperação. Por favor confira sua caixa de entrada.'
          })
          close()
        },
        onError (message) {
          createToast({
            type: 'error',
            title: 'Não foi possível recuperar a sua conta',
            description: message
          })
        }
      }))
    },
    [close, createToast, dispatch]
  )

  return (
    <Modal.Root open={ open } close={ close }>
      <Modal.Title>
        Esqueci minha senha
      </Modal.Title>
      <Modal.Description>
        Informe seu email para recuperar a sua conta
      </Modal.Description>

      <Form
        className="mt-5"
        onSubmit={ handleSubmit(handleForgotPassword) }
      >

        <TextInput.Root className="w-full" error={ errors.email?.message }>
          <TextInput.Input
            placeholder="Informe seu e-mail"
            { ...register('email') }
          />
        </TextInput.Root>

        <Modal.Footer>
          <Button>
            Recuperar conta
          </Button>
        </Modal.Footer>
      </Form>

    </Modal.Root>
  )
}
