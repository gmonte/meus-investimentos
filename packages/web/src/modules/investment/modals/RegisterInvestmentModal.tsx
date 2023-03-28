import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import flow from 'lodash/fp/flow'
import * as yup from 'yup'

import {
  CDIInvestmentDocument,
  InvestmentFormData
} from '~/@types/Investment'
import { Button } from '~/components/Button'
import { Form } from '~/components/Form'
import { Modal } from '~/components/Modal'
import { TextInput } from '~/components/TextInput'
import { ModalProps } from '~/hooks/useModal'
import { useToast } from '~/hooks/useToast'
import { api } from '~/services/api'
import { date } from '~/utils/validators/date.validator'
import { max } from '~/utils/validators/max.validator'
import { min } from '~/utils/validators/min.validator'
import { number } from '~/utils/validators/number.validator'
import { required } from '~/utils/validators/required.validator'

const schema = yup.object().shape<Record<keyof InvestmentFormData, yup.AnySchema>>({
  id: yup.string(),
  name: yup.string(),
  type: required()(yup.string()),
  startDate: flow(
    date(),
    required()
  )(yup.string()),
  dueDate: date()(yup.string()),
  cdiFee: flow(
    number(),
    max(999),
    required()
  )(yup.string()),
  investedValue: flow(
    number(),
    min(1),
    required()
  )(yup.string()),
  rescueDate: date()(yup.string())
})

export interface RegisterInvestmentModalProps extends ModalProps {
  investment?: Omit<CDIInvestmentDocument, 'history'>
}

export function RegisterInvestmentModal({
  open,
  close,
  investment
}: RegisterInvestmentModalProps) {
  const { createToast } = useToast()

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<InvestmentFormData>({
    resolver: yupResolver(schema),
    defaultValues: !investment?.id
      ? undefined
      : {
          cdiFee: investment.cdiFee,
          dueDate: investment.dueDate,
          investedValue: investment.investedValue,
          name: investment.name,
          rescueDate: investment.rescueDate,
          startDate: investment.startDate,
          type: investment.type
        }
  })

  const [
    createCdiInvestment,
    createCdiInvestmentState
  ] = api.useCreateCdiInvestmentMutation()

  const [
    updateCdiInvestment,
    updateCdiInvestmentState
  ] = api.useUpdateCdiInvestmentMutation()

  const isLoading = createCdiInvestmentState.isLoading || updateCdiInvestmentState.isLoading

  const handleCreateUser = useCallback(
    async (data: InvestmentFormData) => {
      const dataFormatted: InvestmentFormData = {
        ...data,
        cdiFee: Number(data.cdiFee),
        investedValue: Number(data.investedValue)
      }

      if (investment?.id) {
        await updateCdiInvestment({
          id: investment.id,
          ...dataFormatted
        })
      } else {
        await createCdiInvestment(dataFormatted)
      }

      createToast({
        type: 'success',
        title: 'Cadastro de investimento',
        description: `Investimento ${ investment?.id ? 'editado' : 'criado' } com sucesso!`
      })

      close()
    },
    [close, createCdiInvestment, createToast, investment?.id, updateCdiInvestment]
  )

  return (
    <Modal.Root open={ open } close={ close }>
      <Modal.Title>
        Cadastro de Investimento
      </Modal.Title>

      <Form
        className="mt-5"
        onSubmit={ handleSubmit(handleCreateUser) }
      >

        <TextInput.Root className="w-full" error={ errors.name?.message }>
          <TextInput.Input
            placeholder="Informe um apelido para o investimento"
            { ...register('name') }
          />
        </TextInput.Root>

        <TextInput.Root className="w-full" error={ errors.type?.message }>
          <TextInput.Input
            placeholder="Tipo de investimento"
            { ...register('type') }
          />
        </TextInput.Root>

        <TextInput.Root className="w-full" error={ errors.startDate?.message }>
          <TextInput.Input
            placeholder="Data inicial"
            { ...register('startDate') }
          />
        </TextInput.Root>

        <TextInput.Root className="w-full" error={ errors.dueDate?.message }>
          <TextInput.Input
            placeholder="Data de vencimento"
            { ...register('dueDate') }
          />
        </TextInput.Root>

        <TextInput.Root className="w-full" error={ errors.cdiFee?.message }>
          <TextInput.Input
            placeholder="Rendimento em relação à taxa CDI"
            { ...register('cdiFee') }
          />
        </TextInput.Root>

        <TextInput.Root className="w-full" error={ errors.investedValue?.message }>
          <TextInput.Input
            placeholder="Valor investido"
            { ...register('investedValue') }
          />
        </TextInput.Root>

        <TextInput.Root className="w-full" error={ errors.rescueDate?.message }>
          <TextInput.Input
            placeholder="Data de resgate"
            { ...register('rescueDate') }
          />
        </TextInput.Root>

        <Modal.Footer>
          <Button loading={ isLoading }>
            {investment?.id ? 'Editar' : 'Cadastrar'}
          </Button>
        </Modal.Footer>
      </Form>

    </Modal.Root>
  )
}
