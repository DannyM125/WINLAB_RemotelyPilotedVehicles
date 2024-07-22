// useGlobalKeyListener.js
import { useEffect } from "react";

export const useKeyMappingsFWUI = (keyMap, handlers) => {
  console.log("Running useKeyMappingsHook");
  useEffect(() => {
    const handleKeyDown = (event) => {
      const action = keyMap[event.key.toUpperCase()];
      //check to see if the action exists and there is a handler for it
      if (action && handlers[action]) {
        handlers[action]();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    //IMPORTANT! this runs on demounts so that it can remove the handler and not conflict with something else
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyMap, handlers]);
};
