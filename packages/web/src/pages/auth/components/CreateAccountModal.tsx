import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import flow from 'lodash/fp/flow'
import * as yup from 'yup'

import { CreateAccountData } from '~/@types/Auth'
import { Button } from '~/components/Button'
import { Form } from '~/components/Form'
import { Modal } from '~/components/Modal'
import { TextInput } from '~/components/TextInput'
import { ModalProps } from '~/hooks/useModal'
import { useToast } from '~/hooks/useToast'
import { useAppDispatch } from '~/store'
import { AuthActions } from '~/store/auth'
import { email } from '~/utils/validators/email.validator'
import { equalTo } from '~/utils/validators/equalTo.validator'
import { password } from '~/utils/validators/password.validator'
import { required } from '~/utils/validators/required.validator'

const schema = yup.object().shape<Record<keyof CreateAccountData, yup.AnySchema>>({
  email: flow(
    email(),
    required()
  )(yup.string()),
  password: password()(yup.string()),
  confirmPassword: equalTo('password', 'Defina sua senha')(yup.string())
})

export function CreateAccountModal({ open, close }: ModalProps) {
  const dispatch = useAppDispatch()
  const { createToast } = useToast()

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<CreateAccountData>({ resolver: yupResolver(schema) })

  const handleCreateUser = useCallback(
    (data: CreateAccountData) => {
      dispatch(AuthActions.createAccount({
        data,
        onSuccess() {
          createToast({
            type: 'success',
            title: 'Tudo certo!',
            description: 'Enviamos um email de confirmação. Por favor confira sua caixa de entrada.'
          })
          close()
        },
        onError(message) {
          createToast({
            type: 'error',
            title: 'Não foi possível criar a sua conta',
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
        Criar conta
      </Modal.Title>
      <Modal.Description>
        Informe um email para criar a sua conta
      </Modal.Description>

      <Form
        className="mt-5"
        onSubmit={ handleSubmit(handleCreateUser) }
      >

        <TextInput.Root className="w-full" error={ errors.email?.message }>
          <TextInput.Input
            placeholder="Informe seu e-mail"
            { ...register('email') }
          />
        </TextInput.Root>

        <TextInput.Root className="w-full" error={ errors.password?.message }>
          <TextInput.InputPassword
            placeholder="Defina sua senha"
            { ...register('password') }
          />
        </TextInput.Root>

        <TextInput.Root className="w-full" error={ errors.confirmPassword?.message }>
          <TextInput.InputPassword
            placeholder="Repita sua senha"
            { ...register('confirmPassword') }
          />
        </TextInput.Root>

        <Modal.Footer>
          <Button>
            Criar Conta
          </Button>
        </Modal.Footer>
      </Form>

    </Modal.Root>
  )
}
