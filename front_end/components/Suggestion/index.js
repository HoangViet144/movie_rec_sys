import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useGetSuggestionQuery } from '../../store/api.slice'
import { useEffect } from 'react'
import { eraseCookie } from '../../utils/cookies'
import Image from 'next/image'

function Suggestion() {
  const router = useRouter()
  const token = useSelector((state) => state.app.token)
  const { data: dataSuggestion, error: errorSuggesion } = useGetSuggestionQuery({ token }, { skip: !token })

  useEffect(() => {
    if (dataSuggestion) {
    } else if (errorSuggesion) {
      if (errorSuggesion.status === 403 && errorSuggesion.data.code === 'token_not_valid') {
        alert('Có lỗi xảy ra, vui lòng thử lại')
        eraseCookie('ACCESS_TOKEN')
        router.push('/login')
      }
    }
  }, [dataSuggestion, errorSuggesion])

  return (
    <div className="px-8">
      <h2 className="text-2xl">Các phim bạn có thể thích</h2>
      <div className="flex flex-wrap justify-center">
        {dataSuggestion &&
          dataSuggestion.result.slice(0, 10).map((ele, idx) => (
            <div
              className="w-80 sm:w-80 p-3 transition duration-100 transform cursor-pointer hover:scale-105 group"
              key={idx}
              onClick={() => {
                router.push(`/watch/?id=${ele.id}`)
              }}
            >
              <Image layout="responsive" height={900} width={600} src={ele.image} onClick={() => {}} />
              <h2 className="text-xl md:text-2xl truncate max-w-md group-hover:font-bold">{ele.name}</h2>
              <p>Tập: {ele.episodes}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Suggestion
