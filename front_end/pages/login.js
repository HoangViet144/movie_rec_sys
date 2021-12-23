import { useState, useEffect } from 'react'
import { useLoginMutation } from '../store/api.slice'
import { setLogin, setToken, testAction } from '../store/app.slice'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { setCookie } from '../utils/cookies'

function Login() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorLogin, setErrorLogin] = useState('')
  const [login, { data: loginData, error: loginError, isLoading: loginLoading }] = useLoginMutation()

  const { token } = useSelector((state) => state.app)

  useEffect(() => {
    if (loginData) {
      dispatch(setLogin(true))
      dispatch(setToken(loginData.access_token))
      setCookie('ACCESS_TOKEN', `${loginData.access_token}`, 3)
      router.push('/')
    } else if (loginError) {
      if (loginError.data.error_code !== 400) {
        setErrorLogin('Có lỗi xảy ra, vui lòng thử lại.')
        return
      }
      if (loginError.data.error_message === 'Email or password is incorrect!') {
        setErrorLogin('Sai tài khoản hoặc mật khẩu. Vui lòng thử lại')
        return
      }
      if (loginError.data.error_messages?.email) {
        setErrorLogin('Không được bỏ trống bất kỳ trường nào')
      }
    }
  }, [loginData, loginError])

  const handleLogin = () => {
    setErrorLogin('')
    login({ email, password })
  }
  return (
    <div className="flex items-center min-h-screen dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto my-10">
          <div className="text-center">
            <h1 className="my-3 text-3xl font-semibold text-white dark:text-gray-200">Đăng nhập</h1>
            <p className="text-white dark:text-white">Chào mừng bạn trở lại</p>
          </div>
          <div className="m-7">
            <form action="">
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm text-gray-400 dark:text-gray-400">
                  Tài khoản
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  className="w-full px-3 py-2 text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="text-sm text-gray-400 dark:text-white">
                    Mật khẩu
                  </label>
                  <a
                    href="#!"
                    className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  placeholder="Mật khẩu của bạn"
                  className="w-full px-3 py-2 text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
              </div>
              <div className="mb-6">
                <button
                  type="button"
                  className="w-full px-3 py-4 text-white bg-indigo-500 flex justify-center rounded-md focus:bg-indigo-600 focus:outline-none"
                  onClick={handleLogin}
                >
                  {loginLoading ? (
                    <div className="w-6 h-6 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                  ) : (
                    <div>Đăng nhập</div>
                  )}
                </button>
                {errorLogin && <div className="text-sm mt-2 text-red-400">* {errorLogin}</div>}
              </div>
              <p className="text-sm text-center text-gray-400">
                Chưa có tài khoản?{' '}
                <Link href="/register" passHref>
                  <a className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800">
                    Đăng ký
                  </a>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
