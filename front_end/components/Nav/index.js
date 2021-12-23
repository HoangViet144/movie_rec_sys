import { useRouter } from 'next/router'

const getClassName = (gerne, title) => {
  if (((!gerne || gerne === 'All') && title === 'All') || gerne === title.toLowerCase()) {
    return 'text-red-500 last:pr-24  cursor-pointer transition duration-100 transform hover:scale-125 hover:text-white active:text-red-500'
  }
  return 'last:pr-24  cursor-pointer transition duration-100 transform hover:scale-125 hover:text-white active:text-red-500'
}

function Nav() {
  const router = useRouter()
  const {
    query: { gerne },
  } = router
  return (
    <nav className="relative">
      <div className="flex px-10 sm:px-20 text-2xl whitespace-nowrap space-x-10 sm:space-x-20 overflow-x-scroll scrollbar-hide mt-10">
        {[
          'All',
          'Action',
          'Adventure',
          'Comedy',
          'Drama',
          'Fantasy',
          'Sci-Fi',
          'Romance',
          'Harem',
          'Horror',
          'Magic',
          'Others',
        ].map((title, idx) => {
          return (
            <h2
              key={idx}
              onClick={() => {
                if (title === 'All') {
                  router.push(`/`)
                } else {
                  router.push(`/?gerne=${title.toLowerCase()}`)
                }
              }}
              className={getClassName(gerne, title)}
            >
              {title}
            </h2>
          )
        })}
      </div>

      <div className="absolute top-0 right-0 bg-gradient-to-l from-[#06202A] h-10 w-1/12"></div>
    </nav>
  )
}

export default Nav
