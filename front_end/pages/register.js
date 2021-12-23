import { useState, useEffect } from 'react'
import { useRegisterMutation, useLoginMutation } from '../store/api.slice'
import Link from 'next/link'
import { setLogin, setToken } from '../store/app.slice'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setCookie } from '../utils/cookies'

function Register() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repass, setRePass] = useState('')
  const [errorRePass, setErrorRePass] = useState('')
  const [errorPass, setErrorPass] = useState('')
  const [register, { data: registerData, error: regiterError, isLoading: loadingReg }] = useRegisterMutation()
  const [login, { data: loginData, error: loginError, isLoading: loadingLog }] = useLoginMutation()

  const handleLogin = () => {
    setErrorRePass('')
    setErrorPass('')
    if (password.length < 8) {
      setErrorPass('Mật khẩu phải có ít nhất 8 ký tự')
    }
    if (password !== repass) {
      setErrorRePass('Mật khẩu xác nhận không khớp!')
    }
    if (password.length < 8 || password !== repass) return
    register({ email, password })
  }

  useEffect(() => {
    if (registerData) {
      login({ email, password })
    } else if (regiterError) {
      if (regiterError.data.error_message === 'This email has already exist!') {
        alert('Email đã được đăng ký!')
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại!')
      }
    }
  }, [regiterError, registerData])

  useEffect(() => {
    if (loginData) {
      dispatch(setLogin(true))
      dispatch(setToken(loginData.access_token))
      setCookie('ACCESS_TOKEN', `${loginData.access_token}`, 3)
      router.push('/')
    } else if (loginError) {
      if (loginError.data.error_code !== 400) {
        alert('Có lỗi xảy ra, vui lòng thử lại.')
        return
      }
      if (loginError.data.error_message === 'Email or password is incorrect!') {
        alert('Sai tài khoản hoặc mật khẩu. Vui lòng thử lại')
        return
      }
      if (loginError.data.error_messages?.email) {
        alert('Không được bỏ trống bất kỳ trường nào')
      }
    }
  }, [loginData, loginError])

  return (
    <div className="flex items-center min-h-screen dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto my-10">
          <div className="text-center">
            <h1 className="my-3 text-3xl font-semibold text-white dark:text-gray-200">Đăng ký</h1>
          </div>
          <div className="m-7">
            <form action="">
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm text-gray-400 dark:text-gray-400">
                  Email
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
                {errorPass && <div className="text-sm mt-2 text-red-400">* {errorPass}</div>}
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="text-sm text-gray-400 dark:text-white">
                    Xác nhận mật khẩu
                  </label>
                </div>
                <input
                  type="password"
                  name="password"
                  id="repassword"
                  value={repass}
                  onChange={(e) => {
                    setRePass(e.target.value)
                  }}
                  placeholder="Nhập lại mật khẩu của bạn"
                  className="w-full px-3 py-2 text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
                {errorRePass && <div className="text-sm mt-2 text-red-400">* {errorRePass}</div>}
              </div>
              <div className="mb-6 mt-6">
                <button
                  type="button"
                  className="w-full px-3 py-4 text-white flex justify-center bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                  onClick={handleLogin}
                >
                  {loadingReg || loadingLog ? (
                    <div className="w-6 h-6 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                  ) : (
                    <div>Đăng ký</div>
                  )}
                </button>
              </div>
              <p className="text-sm text-center text-gray-400">
                Đã có tài khoản?{' '}
                <Link href="/login" passHref>
                  <a className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800">
                    Đăng nhập
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

export default Register
