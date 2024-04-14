import { useCallback } from 'react'
import {
  useForm,
  Controller
} from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import flow from 'lodash/fp/flow'
import moment from 'moment/moment'
import * as yup from 'yup'

import {
  CDIInvestmentDocument,
  InvestmentFormData
} from '~/@types/Investment'
import { Button } from '~/components/Button'
import { Form } from '~/components/Form'
import { Modal } from '~/components/Modal'
import { Radio } from '~/components/Radio'
import { TextInput } from '~/components/TextInput'
import { ModalProps } from '~/hooks/useModal'
import { useToast } from '~/hooks/useToast'
import { api } from '~/services/api'
import {
  fixStrNumber,
  precisionNumberWithoutRound
} from '~/utils/formatters'
import { date } from '~/utils/validators/date.validator'
import { max } from '~/utils/validators/max.validator'
import { min } from '~/utils/validators/min.validator'
import { number } from '~/utils/validators/number.validator'
import { required } from '~/utils/validators/required.validator'

const schema = yup.object().shape<Record<keyof InvestmentFormData, yup.AnySchema>>({
  id: yup.string(),
  bank: yup.string(),
  target: yup.string(),
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
  )(yup.string())
})

export interface RegisterInvestmentModalProps extends ModalProps {
  investment?: Omit<CDIInvestmentDocument, 'history' | 'rescueDate'>
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
    control,
    formState: { errors }
  } = useForm<InvestmentFormData>({
    resolver: yupResolver(schema),
    defaultValues: !investment?.id
      ? { type: 'CDB' }
      : {
          cdiFee: investment.cdiFee,
          dueDate: !investment.dueDate ? undefined : moment(investment.dueDate).format('L'),
          investedValue: Number(precisionNumberWithoutRound(investment.investedValue)),
          bank: investment.bank,
          target: investment.target,
          startDate: moment(investment.startDate).format('L'),
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
        startDate: moment(data.startDate, 'L').format('YYYY-MM-DD'),
        dueDate: !data.dueDate ? undefined : moment(data.dueDate, 'L').format('YYYY-MM-DD'),
        cdiFee: Number(fixStrNumber(String(data.cdiFee))),
        investedValue: Number(fixStrNumber(String(data.investedValue)))
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
        title: `${ investment?.id ? 'Edição' : 'Cadastro' } de investimento`,
        description: `Investimento ${ investment?.id ? 'editado' : 'criado' } com sucesso!`
      })

      close()
    },
    [close, createCdiInvestment, createToast, investment?.id, updateCdiInvestment]
  )

  return (
    <Modal.Root open={ open } close={ close }>
      <Modal.Title>
        {investment?.id ? 'Edição' : 'Cadastro'} de Investimento
      </Modal.Title>

      <Form
        className="mt-5"
        onSubmit={ handleSubmit(handleCreateUser) }
      >
        <TextInput.Root
          label="Banco/Instituição"
          className="w-full"
          error={ errors.bank?.message }
        >
          <TextInput.Input
            placeholder="Informe o banco/instituição do investimento"
            { ...register('bank') }
          />
        </TextInput.Root>

        <TextInput.Root
          label="Objetivo"
          className="w-full"
          error={ errors.target?.message }
        >
          <TextInput.Input
            placeholder="Informe um objetivo para o investimento"
            { ...register('target') }
          />
        </TextInput.Root>

        <Controller
          name="type"
          control={ control }
          render={ ({ field }) => (
            <Radio.Group
              label="Tipo de investimento"
              { ...field }
            >
              <Radio.Item value="CDB" label="CDB" className="flex-1" />
              <Radio.Item value="LCI" label="LCI" className="flex-1" />
              <Radio.Item value="LCA" label="LCA" className="flex-1" />
            </Radio.Group>
          ) }
        />

        <div className="w-full flex gap-2 flex-wrap">
          <TextInput.Root
            label="Indexador"
            className="w-full flex-1"
          >
            <TextInput.Input
              value="CDI"
              disabled
            />
          </TextInput.Root>

          <TextInput.Root
            label="Taxa *"
            className="w-full flex-1"
            error={ errors.cdiFee?.message }
          >
            <Controller
              name="cdiFee"
              control={ control }
              render={ ({ field }) => <TextInput.InputPercentage { ...field }/> }
            />
          </TextInput.Root>
        </div>

        <TextInput.Root
          label="Data inicial *"
          className="w-full"
          error={ errors.startDate?.message }
        >
          <Controller
            name="startDate"
            control={ control }
            render={ ({ field }) => (
              <TextInput.InputDate
                placeholder="Data de aquisição do investimento"
                { ...field }
              />
            ) }
          />
        </TextInput.Root>

        <TextInput.Root
          label="Data de vencimento"
          className="w-full"
          error={ errors.dueDate?.message }
        >
          <Controller
            name="dueDate"
            control={ control }
            render={ ({ field }) => <TextInput.InputDate { ...field } /> }
          />
        </TextInput.Root>

        <TextInput.Root
          label="Valor investido *"
          className="w-full"
          error={ errors.investedValue?.message }
        >
          <Controller
            name="investedValue"
            control={ control }
            render={ ({ field }) => <TextInput.InputCurrency { ...field }/> }
          />
        </TextInput.Root>

        <Modal.Footer>
          <Button loading={ isLoading }>
            {investment?.id ? 'Salvar' : 'Cadastrar'}
          </Button>
        </Modal.Footer>
      </Form>

    </Modal.Root>
  )
}
