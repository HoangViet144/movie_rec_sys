import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getCookie } from './cookies'

export const appApiAxios = axios.create({
  baseURL: process.env.BASE_API_URL,
  timeout: 60000,
  // withCredentials: true,
})

appApiAxios.interceptors.request.use(
  (request) => {
    // request.headers['Authorization'] = `Bearer ${getCookie('ACCESS_TOKEN')}`
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

appApiAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // const { status, data, config } = error?.response || {}
    // const error500URLs =
    //   config.url.includes('/activity/') || config.url.includes('/slot/') || config.url.includes('/user-chance/')
    // //const error425URLs = config.url.includes('/activity/') || config.url.includes('/slot/')

    // if (status === 500 && error500URLs)
    //   store.dispatch(
    //     setError({
    //       status,
    //       data,
    //     }),
    //   )

    return Promise.reject(error)
  },
)

export const axiosRetry = async ({ method = 'GET', url, data, retries = 5, timeWait = 100, lastError, ...rest }) => {
  const options = { method, url, data, ...rest }
  if (retries === 0) throw lastError
  try {
    return await appApiAxios(options)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err) {
    if (err.response?.status === 425) {
      await new Promise((resolve) => requestTimeout(() => resolve(''), timeWait))
      return axiosRetry({
        url,
        data,
        retries: retries - 1,
        timeWait: timeWait * 2 * getRandomNumber(0.4, 1.4),
        lastError: err,
        method,
        ...rest,
      })
    } else throw err
  }
}

export const axiosBaseQuery =
  () =>
  async ({ url, method = 'GET', data, ...rest }) => {
    try {
      const result = await axiosRetry({ url, method, data, ...rest })
      // console.log(result)
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError
      console.log(err)
      return {
        error: { status: err.response?.status, data: err.response?.data },
      }
    }
  }
