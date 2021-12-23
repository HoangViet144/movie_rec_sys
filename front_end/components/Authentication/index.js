import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setLogin, setToken } from '../../store/app.slice'
import { getCookie } from '../../utils/cookies'

function Auth({ children }) {
  const router = useRouter()
  const { isLogin } = useSelector((state) => state.app)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isLogin) return
    if (getCookie('ACCESS_TOKEN') !== '') {
      dispatch(setLogin(true))
      dispatch(setToken(getCookie('ACCESS_TOKEN')))
    } else if (!isLogin && router.pathname !== '/register') {
      router.push('/login')
    }
  }, [isLogin])
  return <div>{children}</div>
}

export default Auth
