import { Button } from '~/components/Button'
import { useAppDispatch } from '~/store'
import { AuthActions } from '~/store/auth'

function Home() {
  const dispatch = useAppDispatch()

  return (
    <div>
      home

      <Button onClick={ () => dispatch(AuthActions.logout()) }>
        sair
      </Button>
    </div>
  )
}

export default Home
