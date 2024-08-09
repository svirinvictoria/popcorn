import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });
  //list of watched movies taken from local storage every time the App component rerenders.
  //whatever this function returns will be the initial state value of this useState hook

  useEffect(
    function () {
      localStorage.setItem("value", JSON.stringify(value));
    },
    [value, key]

    //as useEffect is executed, after the rerender, the value equals empty [].
    //this is what is stored into local storage.
    //now we should read this data into the app, as soon as the APP component mounts.
  );

  return [value, setValue];
}
