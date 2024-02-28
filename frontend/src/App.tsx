import { Routes, Route } from 'react-router-dom'
import MovieList from './components/MovieList'
import MovieDetail from './components/MovieDetail'

function App() {
  return (
    <div className='bg-slate-900 text-white w-full'>
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/:id" element={<MovieDetail />} />
      </Routes>
    </div>
  )
}

export default App
