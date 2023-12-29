import { useEffect, useState } from 'react'
// import './App.css'
import axios from 'axios';

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [pageNo, setPageNo] = useState(1);

  const handleNextPageNo = () => {
    setPageNo(pageNo + 1);
  }

  const handlePrevPageNo = ()=> {
    if(pageNo!== 0){
      setPageNo(pageNo-1);
    }
  }


  const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${pageNo}`
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const res = await axios.get(url, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDhlMjc0NTk2NjdhMGZmOWVkMjg4NmQ1YzExNTE1YyIsInN1YiI6IjYwOGZiYWM2YWFmZWJkMDAyYTQ2Zjk2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qk7Iw2XBdmI-68ZjtNxJitJxfamEvjPNZR-bB7fxXmQ',
            'accept': 'application/json'
          }
        })
        const result = await res.data;
        console.log(result.results);
        setMovies(result.results)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(error?.message)
      }
    }

    fetchMovies()
  }, [pageNo])

  console.log(movies)


  return (
    <>
      <div className='bg-slate-700 text-white w-full'>
        <div className='flex justify-between px-12 py-4'>
          <button className='px-4 py-2 rounded-lg bg-orange-700' onClick={handlePrevPageNo}>Prev Page</button>
          <button className='px-4 py-2 rounded-lg bg-orange-700' onClick={handleNextPageNo}>Next Page</button>
        </div>
        <div className=' mb-4 p-12 flex flex-wrap gap-8 '>
          {
            !loading && movies?.map((movie) => {
              return (
                <div key={movie?.id} className="mb-4">
                  <div className="">
                    <img src={`https://image.tmdb.org/t/p/w500/${movie?.backdrop_path}`} alt={movie?.backdrop} />
                    <p className='text-xl font-semibold w-full mt-2'>{movie.original_title}</p>
                    <span className=''>{movie.title}</span>
                    <p className='text-lg '>Popularity Score: {movie.popularity}</p>
                    <p>Release Date: {movie.release_date}</p>
                    <p>Language: {movie.original_language}</p>
                    <p>IsAdult: {movie?.adult}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default App
