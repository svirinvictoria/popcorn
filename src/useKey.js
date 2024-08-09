import { useEffect } from "react";

export function useKey(key, action) {
  //listening to a keypress- closing the app while presing ESC button
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
          // console.log("Closing");
        }
      }
      document.addEventListener("keydown", callback); //it has to be the same function, not a copy!

      //stop executing a function.
      //otherwise every time we open a move a new eventListener is added to the document.
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [action, key]
  );
}
