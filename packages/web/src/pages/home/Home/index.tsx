import { useEffect } from 'react'

import { Button } from '~/components/Button'
import { api } from '~/services/api'
import { useAppDispatch } from '~/store'
import { AuthActions } from '~/store/auth'

function Home() {
  const dispatch = useAppDispatch()

  const doFetch = async () => {
    const { data } = await api.post('/readCdiInvestment', { id: '5gzPl1ocFn3jSem3FYf8' })
    console.log(data)
  }

  useEffect(
    () => {
      doFetch()
    },
    []
  )

  return (
    <div>
      home

      <Button onClick={ () => dispatch(AuthActions.logout()) }>
        sair
      </Button>

      <Button onClick={ doFetch }>
        fetch
      </Button>
    </div>
  )
}

export default Home
