import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import "./../index.css";

const API_KEY = "bb6c5efc";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        setIsLoading(true);

        const currentYear = new Date().getFullYear();
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=movie&y=${currentYear}&type=movie`
        );
        const data = await response.json();

        if (data.Search) {
          const selectedMovies = data.Search.slice(0, 10);

          const movieData = await Promise.all(
            selectedMovies.map(async (movie) => {
              const detailsResponse = await fetch(
                `http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
              );
              const details = await detailsResponse.json();
              return details;
            })
          );

          setMovies(movieData.sort(() => 0.5 - Math.random()));
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestMovies();
  }, []);

  useEffect(() => {
    if (!isLoading && movies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [movies, isLoading]);

  return (
    <div className="slideshow-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="slide">
          <div className="movie-info">
            <h2>{movies[currentIndex]?.Title}</h2>
            <p>{movies[currentIndex]?.Plot}</p>
            <p>Duration: {movies[currentIndex]?.Runtime || "N/A"}</p>
            <p>Release Date: {movies[currentIndex]?.Year}</p>{" "}
          </div>
          <img
            src={movies[currentIndex]?.Poster}
            alt={movies[currentIndex]?.Title}
          />
        </div>
      )}
    </div>
  );
}
