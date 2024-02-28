import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type movie = {
  original_title: string;
  title: string;
  id: string;
  popularity: number;
  release_date: string;
  original_language: string;
  adult: boolean;
  backdrop_path: string;
  poster_path?: string;
  tagline: string;
  overview: string;
  budget: number;
  genres: [];
  revenue: number;
  username: string;
};

const MovieDetail = () => {
  const params = useParams();
  const movieId = params?.id;
  const [movie, setMovie] = useState<movie>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewContent, setReviewContent] = useState([]);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [movieRes, reviewsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDhlMjc0NTk2NjdhMGZmOWVkMjg4NmQ1YzExNTE1YyIsInN1YiI6IjYwOGZiYWM2YWFmZWJkMDAyYTQ2Zjk2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qk7Iw2XBdmI-68ZjtNxJitJxfamEvjPNZR-bB7fxXmQ',
              'accept': 'application/json'
            }
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US&page=1`, {
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDhlMjc0NTk2NjdhMGZmOWVkMjg4NmQ1YzExNTE1YyIsInN1YiI6IjYwOGZiYWM2YWFmZWJkMDAyYTQ2Zjk2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qk7Iw2XBdmI-68ZjtNxJitJxfamEvjPNZR-bB7fxXmQ',
              'accept': 'application/json'
            }
          }),
        ]);

        setMovie(movieRes.data);
        setReviews(reviewsRes.data.results);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  useEffect(() => {
    if (reviews) {
      const movieReviews = reviews?.map((review: any) => review.content);
      setReviewContent(movieReviews);

      const getReviewSentiment = async () => {
        try {
          const payload = {
            reviews: movieReviews,
          };

          const res = await axios.post("http://127.0.0.1:5000/predict", payload);
          const result = res.data;
          setPredictions(result.predictions);
          console.log(result);
        } catch (error) {
          console.error(error);
        }
      };

      getReviewSentiment();
    }
  }, [reviews]);

  console.log(movie);
  console.log(reviews);
  console.log(predictions);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex p-4  gap-8 flex-start">
          <div className="w-1/3">
            <img className="mb-4" src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`} alt={movie?.id} />
            <img src={`https://image.tmdb.org/t/p/w500/${movie?.backdrop_path}`} />
          </div>
          <div className="w-1/2">
            <h2 className="text-2xl font-museomoderno my-2">{movie?.original_title}</h2>
            <p className="text-xl font-montserrat">{movie?.tagline}</p>
            <div className="opacity-80 font-montserrat mt-2">
              <p className="text-lg w-8/12">{movie?.overview}</p>

              <div className="my-2">
                <p className="mt-1">
                  <span className="opacity-100 font-semibold">Budget: </span> ${movie?.budget}
                </p>
                <p className="mt-1">
                  <span className="opacity-100 font-semibold">Genre: </span> {movie?.genres.map((gen: any) => gen?.name).join(", ")}
                </p>
                <p className="mt-1">
                  <span className="opacity-100 font-semibold">Release Date: </span> {movie?.release_date}
                </p>
                <p className="mt-1">
                  <span className="opacity-100 font-semibold">Revenue: </span>${movie?.revenue}
                </p>
                <p className="mt-1">
                  <span className="opacity-100 font-semibold">Popularity: </span> {movie?.popularity}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-nunito">Reviews ({reviews?.length})</h2>

              {reviews?.map((review, index) => (
                <div key={index} className="mb-4 font-montserrat">
                  <h2>
                    <span className="opacity-100 font-semibold">User: </span> {review?.author}
                  </h2>
                  <p>
                    <span className="opacity-100 font-semibold">Username: </span> {review?.author_details.username}
                  </p>
                  <p>
                    <span className="opacity-100 font-semibold">Review: </span>
                    {review?.content}
                  </p>

                  {predictions[index] && (
                    <p>
                      <span className="opacity-100 font-semibold">Prediction: </span>
                      {predictions[index]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
