import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import flow from 'lodash/fp/flow'
import * as yup from 'yup'

import { InvestmentFormData } from '~/@types/Investment'
import { Button } from '~/components/Button'
import { Form } from '~/components/Form'
import { Modal } from '~/components/Modal'
import { TextInput } from '~/components/TextInput'
import { ModalProps } from '~/hooks/useModal'
import { date } from '~/utils/validators/date.validator'
import { max } from '~/utils/validators/max.validator'
import { min } from '~/utils/validators/min.validator'
import { number } from '~/utils/validators/number.validator'
import { required } from '~/utils/validators/required.validator'

const schema = yup.object().shape<Record<keyof InvestmentFormData, yup.AnySchema>>({
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

export function CreateInvestmentModal({ open, close }: ModalProps) {
  // const dispatch = useAppDispatch()
  // const { createToast } = useToast()

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<InvestmentFormData>({ resolver: yupResolver(schema) })

  const handleCreateUser = useCallback(
    (data: InvestmentFormData) => {
      console.log('data', data)
    },
    []
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

        <Modal.Footer>
          <Button>
            Cadastrar
          </Button>
        </Modal.Footer>
      </Form>

    </Modal.Root>
  )
}
