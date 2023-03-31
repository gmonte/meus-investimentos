import { UserResume as UserResumeType } from '~/@types/Investment'
import { Growth } from '~/components/Growth'
import { Text } from '~/components/Text'
import { useAppSelector } from '~/store'
import { selectUser } from '~/store/auth/selectors'
import {
  formatCurrency,
  formatNumber
} from '~/utils/formatters'

export interface UserResumeProps {
  userResume?: UserResumeType
}

export function UserResume({ userResume }: UserResumeProps) {
  const user = useAppSelector(selectUser)

  if (!user) {
    return null
  }

  if (!userResume) {
    return null
  }

  console.log('userResume', userResume)

  return (
    <div className="flex flex-col text-white items-center max-sm:gap-1">
      <Text size="xl">
        Olá, {user.displayName && <span className="italic">{ user.displayName }</span>}
      </Text>

      <div className="flex items-center min-[640px]:gap-2 max-sm:flex-col max-sm:mb-1">
        <Text>
          Você já investiu
        </Text>
        <Text className="font-mono font-bold" size="xl">
          {formatCurrency(userResume.investedValue)}
        </Text>
      </div>

      <div className="flex items-center min-[640px]:gap-2 max-sm:flex-col max-sm:mb-2">
        <Text>
          Seu retorno bruto é de
        </Text>
        <Text className="font-mono font-bold" size="xl">
          {formatCurrency(userResume.grossValue)}
        </Text>
        <div className="flex items-center gap-2">
          <Growth>
            {formatNumber(userResume.grossGrowth)}%
          </Growth>
          <Growth>
            {formatCurrency(userResume.grossValueIncome)}
          </Growth>
        </div>
      </div>

      <div className="flex items-center min-[640px]:gap-2 max-sm:flex-col">
        <Text>
          Seu retorno líquido é de
        </Text>
        <Text className="font-mono font-bold" size="xl">
          {formatCurrency(userResume.netValue)}
        </Text>
        <div className="flex items-center gap-2">
          <Growth>
            {formatNumber(userResume.netGrowth)}%
          </Growth>
          <Growth>
            {formatCurrency(userResume.netValueIncome)}
          </Growth>
        </div>
      </div>
    </div>
  )
}
