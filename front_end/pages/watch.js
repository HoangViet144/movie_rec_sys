import StarRatings from 'react-star-ratings'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useGetMoviesQuery, useWatchingMutation } from '../store/api.slice'
import { useSelector } from 'react-redux'
import { useRatingMutation, useGetSuggestionQuery } from '../store/api.slice'
import Image from 'next/image'

function Watch() {
  const router = useRouter()
  const token = useSelector((state) => state.app.token)
  const {
    isReady,
    query: { id },
  } = router
  const { data, error: errorMovie, isLoading } = useGetMoviesQuery({ token }, { skip: !isReady || !token })
  const [rateOnDB, { data: rateDBData, error: rateDBError }] = useRatingMutation()
  const [watchOnDB, { data: watchDBData, error: watchDBError }] = useWatchingMutation()
  const { data: dataSuggestion, error: errorSuggesion } = useGetSuggestionQuery({ token }, { skip: !token })

  const [rating, setRating] = useState(0)
  const [ele, setEle] = useState(null)
  const onRatingChange = (val) => {
    setRating(val)
    if (ele) {
      rateOnDB({ movieid: ele.id, rating: (val * 9) / 5, token })
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  useEffect(() => {
    if (!data || !id) return
    const ele = data.result.find((ele) => ele.id === +id)
    setRating((ele.rating * 5) / 9)
    setEle(ele)
    watchOnDB({ movieid: ele.id, rating: 0.1, token })
  }, [data, id])

  useEffect(() => {
    if (rateDBData) {
    } else if (rateDBError) {
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }, [rateDBData, rateDBError])

  useEffect(() => {
    if (watchDBData) {
    } else if (watchDBError) {
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }, [watchDBData, watchDBError])

  useEffect(() => {
    if (dataSuggestion) {
    } else if (errorSuggesion) {
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }, [dataSuggestion, errorSuggesion])

  useEffect(() => {
    if (errorMovie) router.push('/')
  }, [errorMovie])

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center mt-12">
        <div className="w-10 h-10 border-b-2 border-white rounded-full animate-spin"></div>
        <p className="mt-2">Đợi một chút nhé</p>
      </div>
    )
  return (
    <>
      <div
        className="xs:absolute xs:right-0 xs:top-0 cursor-pointer flex justify-center"
        onClick={() => {
          router.push('/')
        }}
      >
        <Image className="object-contain" src="https://links.papareact.com/ua6" width={200} height={100} />
      </div>
      <div className="flex flex-col justify-center items-center p-5">
        <div className="self-start mb-8">
          <h2 className="text-xl xs:text-3xl">Xem phim: {`${ele?.name ?? ''}`}</h2>
          <p className="mt-2 xs:mt-1">Tập: {`${ele?.episodes ?? ''}`}</p>
        </div>
        <iframe
          className="w-3/4 xs:h-[65vh] h-[20vh]"
          // width="853"
          // height="480"
          src={`https://www.youtube.com/embed/qig4KOK2R2g?enablejsapi=1&wmode=opaque&autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
        <div className="flex items-center mt-5">
          <p className="mr-2">Rating: </p>
          <div className="z-50">
            <StarRatings
              rating={rating}
              starRatedColor="yellow"
              starHoverColor="yellow"
              changeRating={onRatingChange}
              numberOfStars={5}
              name="rating"
              starDimension="25px"
              starSpacing="5px"
            />
          </div>
        </div>
      </div>
      <div className="relative mt-1 p-5">
        <h2 className="text-xl mb-5">Các phim liên quan</h2>
        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 flex flex-col items-center">
          {dataSuggestion &&
            dataSuggestion.result.map((ele, idx) => (
              <div
                className="w-80 sm:w-60 p-3 transition duration-100 transform cursor-pointer hover:scale-105"
                key={idx}
                onClick={() => {
                  router.push(`/watch/?id=${ele.id}`)
                }}
              >
                <Image layout="responsive" height={900} width={600} src={ele.image} onClick={() => {}} />
                <h2 className="text-xl md:text-2xl truncate max-w-md">{ele.name}</h2>
                <p>Tập: {ele.episodes}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default Watch
