import { Button } from '~/components/Button'
import { api } from '~/services/api'
import { useAppDispatch } from '~/store'
import { AuthActions } from '~/store/auth'

function Home() {
  const dispatch = useAppDispatch()

  const { data } = api.useGetUserCdiInvestmentsQuery()

  console.log('data', data)

  return (
    <div>
      home

      <Button onClick={ () => dispatch(AuthActions.logout()) }>
        sair
      </Button>

      <Button>
        fetch
      </Button>
    </div>
  )
}

export default Home
