import { useState, useEffect } from "react";

const KEY = "5f953a9fa8a229b7719a351b39cd8c9f";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=${query}
`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something Went Wrong with Fetching Movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found!");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
