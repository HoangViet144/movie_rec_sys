import Thumbnail from '../Thumbnail'

function Results({ data }) {
  return (
    <div className="px-3 sm:px-5 my-10 sm:grid md:grid-cols-4 xl:grid-cols-5 3xl:flex flex-wrap justify-center">
      {data.map((result) => (
        <Thumbnail key={result.id} result={result} />
      ))}
    </div>
  )
}

export default Results
