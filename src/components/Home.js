import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import "./../index.css";

const KEY = "5f953a9fa8a229b7719a351b39cd8c9f";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [genres, setGenres] = useState({});

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${KEY}&language=en-US`
        );
        const data = await res.json();
        const genreMap = data.genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});
        setGenres(genreMap);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    }

    fetchGenres();
  }, []);

  useEffect(() => {
    async function fetchTrendingMovies() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${KEY}`
        );
        const data = await res.json();
        if (data.results) {
          const selectedMovies = data.results;
          setMovies(selectedMovies.sort(() => 0.5 - Math.random()));
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    if (!isLoading && movies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [movies, isLoading]);

  return (
    <div className="slideshow-container">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className={`slide ${index === currentIndex ? "active" : ""}`}
            >
              <div className="movie-info">
                <h2>{movie.title}</h2>
                <p>{movie.overview}</p>
                <p>
                  Genre:{" "}
                  {movie.genre_ids
                    .map((id) => genres[id] || "Unknown")
                    .join(", ")}
                </p>
                <p>Release Date: {movie.release_date}</p>
              </div>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`Poster of ${movie.title}`}
              />
            </div>
          ))}
          <button
            className="arrow arrow-right"
            onClick={() =>
              setCurrentIndex(
                (currentIndex - 1 + movies.length) % movies.length
              )
            }
          >
            ◀
          </button>
          <button
            className="arrow arrow-left"
            onClick={() => setCurrentIndex((currentIndex + 1) % movies.length)}
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
}
