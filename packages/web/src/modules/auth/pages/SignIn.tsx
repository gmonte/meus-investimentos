import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import flow from 'lodash/fp/flow'
import {
  GithubLogo,
  GoogleLogo
} from 'phosphor-react'
import * as yup from 'yup'

import { SignInData } from '~/@types/Auth'
import { Button } from '~/components/Button'
import { Divider } from '~/components/Divider'
import { Form } from '~/components/Form'
import { Heading } from '~/components/Heading'
import { Text } from '~/components/Text'
import { TextInput } from '~/components/TextInput'
import { useModal } from '~/hooks/useModal'
import { useToast } from '~/hooks/useToast'
import { useAppDispatch } from '~/store'
import { AuthActions } from '~/store/auth'
import { email } from '~/utils/validators/email.validator'
import { required } from '~/utils/validators/required.validator'

import { CreateAccountModal } from '../modals/CreateAccountModal'
import { ForgotPasswordModal } from '../modals/ForgotPasswordModal'

const schema = yup.object().shape<Record<keyof SignInData, yup.AnySchema>>({
  email: flow(
    email(),
    required()
  )(yup.string()),
  password: required()(yup.string())
})

export default function SignIn() {
  const dispatch = useAppDispatch()

  const { createModal } = useModal()
  const { createToast } = useToast()

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<SignInData>({ resolver: yupResolver(schema) })

  const handleLogin = useCallback(
    (data: SignInData) => {
      dispatch(AuthActions.login({
        data,
        onError(message) {
          createToast({
            type: 'error',
            title: 'Ocorreu um erro ao efetuar o login',
            description: message
          })
        }
      }))
    },
    [createToast, dispatch]
  )

  const handleSignIn = useCallback(
    (providerId: string) => {
      dispatch(AuthActions.loginPopup({
        providerId,
        onError(message) {
          createToast({
            type: 'error',
            title: 'Ocorreu um erro ao efetuar o login',
            description: message
          })
        }
      }))
    },
    [createToast, dispatch]
  )

  const handleForgotPassword = useCallback(
    () => createModal({
      id: 'forgot-password-modal',
      Component: ForgotPasswordModal
    }),
    [createModal]
  )

  const handleCreateAccount = useCallback(
    () => createModal({
      id: 'create-account-modal',
      Component: CreateAccountModal
    }),
    [createModal]
  )

  return (
    <div className="flex items-center justify-center flex-1 flex-col">

      <header className="flex flex-col items-center">
        <Heading size="lg" className="mt-4">
          Meus Investimentos
        </Heading>

        <Text size="lg" className="text-gray-400 mt-1">
          Faça seu login e comece a usar!
        </Text>
      </header>

      <div className="flex items-center justify-center flex-col">
        <Form
          className="mt-6"
          onSubmit={ handleSubmit(handleLogin) }
        >
          <TextInput.Root className="w-full" error={ errors.email?.message }>
            <TextInput.Input
              placeholder="Informe seu e-mail"
              { ...register('email') }
            />
          </TextInput.Root>

          <TextInput.Root className="w-full" error={ errors.password?.message }>
            <TextInput.InputPassword
              placeholder="Informe sua senha"
              { ...register('password') }
            />
          </TextInput.Root>

          <Text size="sm" asChild className="hover:underline text-right text-white">
            <button type="button" onClick={ handleForgotPassword }>
              Esqueci minha senha
            </button>
          </Text>

          <Button className="mt-2">
            Acessar
          </Button>
        </Form>

        <Text asChild className="mt-4 hover:underline text-white">
          <button onClick={ handleCreateAccount }>
            Criar Conta
          </button>
        </Text>

        <Divider>
          OU
        </Divider>

        <Button
          startIcon={ <GoogleLogo size={ 24 } color="red" /> }
          className="mt-2 w-full bg-white hover:bg-gray-100 active:bg-gray-200"
          onClick={ async () => handleSignIn('google') }
        >
          Acessar com Google
        </Button>

        <Button
          startIcon={ <GithubLogo size={ 24 } color="white" /> }
          className="mt-3 w-full bg-black hover:bg-black active:bg-black text-white"
          onClick={ async () => handleSignIn('github') }
        >
          Acessar com GitHub
        </Button>
      </div>

    </div>
  )
}
