import {
  useCallback,
  useMemo
} from 'react'
import {
  useForm,
  Controller
} from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import flow from 'lodash/fp/flow'
import moment from 'moment/moment'
import * as yup from 'yup'

import {
  RescueFormData,
  ShortCDIInvestmentDocument
} from '~/@types/Investment'
import { Button } from '~/components/Button'
import { Form } from '~/components/Form'
import { Modal } from '~/components/Modal'
import { Text } from '~/components/Text'
import { TextInput } from '~/components/TextInput'
import { ModalProps } from '~/hooks/useModal'
import { useToast } from '~/hooks/useToast'
import { api } from '~/services/api'
import {
  fixStrNumber,
  formatCurrency
} from '~/utils/formatters'
import { date } from '~/utils/validators/date.validator'
import { max } from '~/utils/validators/max.validator'
import { min } from '~/utils/validators/min.validator'
import { number } from '~/utils/validators/number.validator'
import { required } from '~/utils/validators/required.validator'

const createSchema = (investment: ShortCDIInvestmentDocument) => yup.object().shape<Record<keyof RescueFormData, yup.AnySchema>>({
  date: date()(yup.string()),
  investmentId: yup.string(),
  value: flow(
    number(),
    min(1),
    max(investment.netValue),
    required()
  )(yup.string())
})

export interface RescueInvestmentModalProps extends ModalProps {
  investment: ShortCDIInvestmentDocument
}

export function RescueInvestmentModal({
  open,
  close,
  investment
}: RescueInvestmentModalProps) {
  const { createToast } = useToast()

  const schema = useMemo(
    () => createSchema(investment),
    [investment]
  )

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<RescueFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      investmentId: investment.id,
      date: moment().format('L')
    }
  })

  const [
    rescueCdiInvestment,
    { isLoading }
  ] = api.useRescueCdiInvestmentMutation()

  const handleRescueInvestment = useCallback(
    async (data: RescueFormData) => {
      const dataFormatted: RescueFormData = {
        ...data,
        date: moment(data.date, 'L').format('YYYY-MM-DD'),
        value: Number(fixStrNumber(String(data.value)))
      }

      await rescueCdiInvestment(dataFormatted)

      createToast({
        type: 'success',
        title: 'Resgate de investimento',
        description: 'Investimento resgatado com sucesso!'
      })

      close()
    },
    [close, createToast, rescueCdiInvestment]
  )

  return (
    <Modal.Root open={ open } close={ close }>
      <Modal.Title>
        Resgate de Investimento
      </Modal.Title>

      <Form
        className="mt-5"
        onSubmit={ handleSubmit(handleRescueInvestment) }
      >

        <TextInput.Root
          label="Data de resgate *"
          className="w-full"
          error={ errors.date?.message }
        >
          <Controller
            name="date"
            control={ control }
            render={ ({ field }) => (
              <TextInput.InputDate { ...field } />
            ) }
          />
        </TextInput.Root>

        <TextInput.Root
          label="Valor resgatado *"
          className="w-full"
          error={ errors.value?.message }
        >
          <Controller
            name="value"
            control={ control }
            render={ ({ field }) => <TextInput.InputCurrency { ...field }/> }
          />
        </TextInput.Root>
        <Text className="font-bold text-gray-500">
          Valor máximo: {formatCurrency(investment.netValue)}
        </Text>

        <Modal.Footer>
          <Button loading={ isLoading }>
            Resgatar
          </Button>
        </Modal.Footer>
      </Form>

    </Modal.Root>
  )
}
