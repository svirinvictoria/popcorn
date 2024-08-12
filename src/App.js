import { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useKey } from "./useKey";
import { useLocalStorageState } from "./useLocalStorageState";

const KEY = "aa8ca65f";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

/////////////////////////////////////////////////////////////////////////

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  // //   const [watched, setWatched] = useState([]); //list of watched movies/right box/
  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // }); //list of watched movies taken from local storage every time the App component rerenders.

  function handleSelectedMovie(id) {
    // when we have already chosen this movie and movie details are open in watchedMovies ,
    // it will set id to nuul thus closing the movie details.
    //else it will open the movie details in watchedMovies.
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie(id) {
    setSelectedId(null);
  }

  //adding a new movie to WATCHED array- creating new array
  //with current watched array and add a new movie obj.

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // we can update a local storage every time a movie is added
    //here we can only store key-value pairs, i.e. everything must be converted to string
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  //to delete movie from the array by id. films which id is different
  //from the given id will stay in array. other will be deleted
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbId !== id));
  }

  //updating a  local storrage in useEffect. we can later make this data reusable.
  //we create a new state and give it a callback as initial value.

  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify(watched));
  //   },
  //   [watched]

  //   //now we should read this data into the app, as soon as the APP component mounts.
  // );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* <Box>{isLoading ? <Loader /> : <MovieList movies={movies} />}</Box> */}
        <Box>
          {/* //rendering components whith mutually exclusive conditions */}
          {/* when the component is still loading */}
          {isLoading && <Loader />}
          {/* //When the component is not loading and there is no error, display list of movies */}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              handleSelectedMovie={handleSelectedMovie}
              watched={watched}
            />
          )}
          {/* //When an error occures display a message */}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              handleCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
      <Footer />
    </>
  )
}
///////////////////////////////////////////////////////////////////////////////////

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null); //1- creating a ref with initial value.

  //reacting on pressing 'enter' key with useKey Hook
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  // useEffect(
  //   function () {
  //     function callback(e) {
  //       //checking which element is currently active. if it's our search element- don't do anything
  //       if (document.activeElement === inputEl.current) return;

  //       //if the pressed key is ENTER, focus on element
  //       if (e.code === "Enter") {
  //         inputEl.current.focus();
  //         setQuery("");
  //       }
  //     }
  //     document.addEventListener("keydown", callback);
  //     return () => document.addEventListener("keydown", callback);
  //   },
  //   [setQuery]
  // );
  //3- using  a ref with useEffect
  useEffect(function () {
    console.log(inputEl.current);
    inputEl.current.focus();
  });
  //this will select the input field. but this is manually selection. not REACT's way
  //   useEffect(function () {
  //     const el = document.querySelector(".search");
  //     console.log(el);
  //     el.focus();
  //   });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl} //2- giving an element a ref property and passing in a ref. connecting a ref with DOM element
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, handleSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectedMovie={handleSelectedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectedMovie }) {
  return (
    <li onClick={() => handleSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// function WatchedBox({ children }) {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {
//         isOpen2 && children
//         // (
//         //   // <>
//         //   //   <WatchedSummary watched={watched} />
//         //   //   <WatchedMoviesList watched={watched} />
//         //   // </>
//         // )
//       }
//     </div>
//   );
// }

function MovieDetails({ selectedId, handleCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(" ");

  const countRef = useRef(0); // each time a user gives a new rating, the REF should be updated

  //updating a ref- use useEffect
  useEffect(
    function () {
      if (userRating) {
        countRef.current = countRef.current + 1;
      }
    },
    [userRating]
  );
  //derived state- transforming array of objects into array of IDs
  const isWatched = watched.map((movie) => movie.imdbId).includes(selectedId);

  // console.log(movie);

  //placing the current rating
  const watchedUserRating = watched.find(
    (movie) => movie.imdbId === selectedId
  )?.userRating;

  //distructuring the object to rewrite variables' names
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const isTop = imdbRating > 8;
  console.log(isTop);

  //   const [avgRating, setAvgRating] = useState(0);

  function handleAdd() {
    const newWatchedMovie = {
      imdbId: selectedId,
      title: title,
      year: year,
      poster: poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDesicions: countRef.current, //this will write down the counter of the rating of single user
    };
    onAddWatched(newWatchedMovie);
    handleCloseMovie();

    // setAvgRating(Number(imdbRating));
    // setAvgRating((avgRating) => (avgRating + userRating) / 2);
  }

  // //listening to a keypress- closing the app while presing ESC button
  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (e.code === "Escape") {
  //         handleCloseMovie();
  //         // console.log("Closing");
  //       }
  //     }
  //     document.addEventListener("keydown", callback); //it has to be the same function, not a copy!

  //     //stop executing a function.
  //     //otherwise every time we open a move a new eventListener is added to the document.
  //     return function () {
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [handleCloseMovie]
  // );

  useKey("Escape", handleCloseMovie);

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  //the title of chosen movie is logged to the page title
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      //this is a cleanup function.
      //returns the title to previous value after the component has unmounted (disappeared)
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>
              &larr;{" "}
            </button>
            <img src={poster} alt="poster" />
            <div className="details-overview">
              <h2>{title} </h2>
              <p>
                {released} &bull; {runtime}{" "}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          {/* <p>{avgRating} </p> */}
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    // onSetRating={setMovieRating} - this didn't work since the prop in component is called setMovieRating
                    setMovieRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list{" "}
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie with {watchedUserRating} <span> ⭐</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p> Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, handleDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          handleDeleteWatched={handleDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, handleDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => handleDeleteWatched(movie.imdbId)}
        >
          ❌
        </button>
      </div>
    </li>
  );
}

function Loader() {
  return <p className="loader">⏳ Loading ...⏳</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function Footer() {
  return (
    <p className="footer">
     <span>&copy; 2024 by Victoria Svirin.</span> <span>Design and guidance by Jonas Schmedtmann</span> 
    </p>
  );
}
