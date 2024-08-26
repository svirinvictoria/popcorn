import { useEffect, useState } from "react";

//this is a function! it accepts arguments, not props!
export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]); //list of movies from the server (API call)/ left box/
  const [isLoading, setIsLoading] = useState(false);
  //used to store an error message and then display it in the UI
  const [error, setError] = useState("");

  useEffect(
    function () {
      //this function will only be called if it exists.
      //   callback?.();

      //cleaning up data fetching with abort controller (coming from browser API)
      const controller = new AbortController();

      async function fetchMovies() {
        //if the fetching fails(i.e. no internet) use try/catch
        try {
          setIsLoading(true);
          setError(""); // cleaning the error state
          const res = await fetch(
            `${process.env.REACT_APP_URL}&s=${query}`,
            { signal: controller.signal } //connecting abortController with fetch
          );
          if (!res.ok) {
            throw new Error("fetching failed");
          }
          const data = await res.json();

          // if no movie found
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError(""); // cleaning the error state
        } catch (err) {
          //the error massage is displaied on the screen
          if (err.name !== "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      //when the search field is empty or has less then 3 signs
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
      //this is a cleanup function coming from abortController
      //it cancels the current request each time that the new one comes in.
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
