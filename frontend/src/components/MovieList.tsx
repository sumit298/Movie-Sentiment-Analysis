import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from './SearchMovie';
import useDebounce from '../hooks/useDebounce';

interface Movie {
    original_title: string;
    title: string;
    id: string;
    popularity: number;
    release_date: string;
    original_language: string;
    adult: boolean;
    backdrop_path: string;
    poster_path?: string;
}

const MovieList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const [pageNo, setPageNo] = useState(1);
    const [genreIds, setGenreIds] = useState<number[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const debounceValue = useDebounce(searchValue.trim());

    const handleNextPageNo = () => {
        setPageNo(pageNo + 1);
    };

    const handlePrevPageNo = () => {
        if (pageNo !== 0) {
            setPageNo(pageNo - 1);
        }
    };

    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pageNo}`;

    useEffect(() => {
        const fetchSearchedData = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${debounceValue}&include_adult=false&language=en-US&page=1`, {
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDhlMjc0NTk2NjdhMGZmOWVkMjg4NmQ1YzExNTE1YyIsInN1YiI6IjYwOGZiYWM2YWFmZWJkMDAyYTQ2Zjk2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qk7Iw2XBdmI-68ZjtNxJitJxfamEvjPNZR-bB7fxXmQ',
                        'accept': 'application/json'
                      }
                });
                const result = response.data;
                console.log(result);
                setMovies(result.results)
            } catch (error) {
                console.error(error);
            }
        };
        fetchSearchedData();
    }, [debounceValue]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const res = await axios.get(url, {
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDhlMjc0NTk2NjdhMGZmOWVkMjg4NmQ1YzExNTE1YyIsInN1YiI6IjYwOGZiYWM2YWFmZWJkMDAyYTQ2Zjk2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qk7Iw2XBdmI-68ZjtNxJitJxfamEvjPNZR-bB7fxXmQ',
                        'accept': 'application/json'
                      }
                });
                const result = res.data;
                console.log(result.results);
                setMovies(result.results);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error?.message);
            }
        };

        fetchMovies();
    }, [pageNo, url]);

    return (
        <div>
            <div className='flex justify-between px-12 py-8 gap-4'>
                <button className='px-4 py-2 rounded-lg bg-orange-700' onClick={handlePrevPageNo}>Prev Page</button>
                <SearchBar searchValue={searchValue} handleSearch={handleSearch} />
                <button className='px-4 py-2 rounded-lg bg-orange-700' onClick={handleNextPageNo}>Next Page</button>
            </div>
            <div className=' mb-4 p-12 flex flex-wrap gap-8 font-montserrat '>
                {!loading && movies?.map((movie) => (
                    <Link to={`${movie.id}`} key={movie.id} className="mb-4">
                        <div className="">
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`} alt={movie.backdrop_path} />
                            <p className='text-xl font-semibold w-full mt-2 font-museomoderno'>{movie.original_title}</p>
                            <span className='font-nunito'>{movie.title}</span>
                            <p className='text-lg '>Popularity Score: {movie.popularity}</p>
                            <p>Release Date: {movie.release_date}</p>
                            <p>Language: {movie.original_language}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MovieList;
