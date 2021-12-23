import Head from 'next/head'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Results from '../components/Results'
import { useGetMoviesQuery, useGetSuggestionQuery } from '../store/api.slice'
import { eraseCookie } from '../utils/cookies'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Suggestion from '../components/Suggestion'

export default function Home() {
  const router = useRouter()
  const token = useSelector((state) => state.app.token)
  const { data, error: errorMovie, isLoading } = useGetMoviesQuery({ token }, { skip: !token })
  const { data: dataSuggestion, error: errorSuggesion } = useGetSuggestionQuery({ token }, { skip: !token })
  const [displayData, setDisplayData] = useState([])
  const [loading, setLoading] = useState(false)

  const {
    isReady,
    query: { gerne },
  } = router

  useEffect(() => {
    if (!errorSuggesion && !errorMovie) return
    if (
      // (errorAMovie.status === 403 && errorAMovie.data.code === 'token_not_valid') ||
      errorMovie.status === 403 &&
      errorMovie.data.code === 'token_not_valid'
    ) {
      eraseCookie('ACCESS_TOKEN')
      router.push('/login')
    }
  }, [errorSuggesion, errorMovie])

  useEffect(() => {
    if (!isReady || !data) return
    setLoading(true)
    if (!gerne) {
      setDisplayData(data.result)
    } else {
      setDisplayData(data.result.filter((ele) => ele.genre.toLowerCase().includes(gerne)))
    }
  }, [isReady, data, gerne])

  useEffect(() => {
    setLoading(false)
  }, [displayData])

  return (
    <div>
      <Head>
        <title>{`${process.env.APP_NAME}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      {/* HEADER */}

      <Suggestion />

      <Nav />
      {/* NAV */}
      {!isLoading && !loading && data ? (
        <Results data={displayData} />
      ) : (
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="w-10 h-10 border-b-2 border-white rounded-full animate-spin"></div>
          <p className="mt-2">Đợi một chút nhé</p>
        </div>
      )}
      {/* RESULTS */}
    </div>
  )
}
