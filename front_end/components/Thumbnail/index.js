import Image from 'next/image'
import StarRatings from 'react-star-ratings'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useRatingMutation } from '../../store/api.slice'
import { useSelector } from 'react-redux'

function Thumbnail({ result }) {
  const [rating, setRating] = useState(result.rating ? (result.rating / 9) * 5 : 0)
  const token = useSelector((state) => state.app.token)

  const [rateOnDB, { data: rateDBData, error: rateDBError }] = useRatingMutation()
  const router = useRouter()
  const onRatingChange = (val) => {
    console.log(val)
    setRating(val)
    rateOnDB({ movieid: result.id, rating: (val * 9) / 5, token })
  }

  useEffect(() => {
    if (rateDBData) {
    } else if (rateDBError) {
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }, [rateDBData, rateDBError])

  const handleMovieClick = () => {
    router.push(`/watch/?id=${result.id}`)
  }
  return (
    <div className="group cursor-pointer sm:p-3 w-80">
      <Image layout="responsive" height={900} width={600} src={result.image} onClick={handleMovieClick} />
      <div className="p-2">
        <p className="truncate max-w-md">{result.genre}</p>
        <p className="truncate max-w-md text-lg">Tập: {result.episodes}</p>
        <h2
          className="mt-1 text-2xl text-white transition-all duration-100 ease-in-out group-hover:font-bold truncate"
          onClick={handleMovieClick}
        >
          {result.name}
        </h2>
        <div className="z-50">
          <StarRatings
            rating={rating}
            starRatedColor="yellow"
            starHoverColor="yellow"
            changeRating={onRatingChange}
            numberOfStars={5}
            name="rating"
            starDimension="20px"
            starSpacing="3px"
          />
        </div>
      </div>
    </div>
  )
}

export default Thumbnail
