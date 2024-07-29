import { useEffect, useState } from "react";
import { sendData } from "../networking/websocket";

const M_IP = "10.147.17.144";
const M_PORT = 6744;
let keydownTriggered = false;
export const useKeyMappings = (keyMap, buttonRefs) => {
  useEffect(() => {
    //TBH, this is a stupid hack that i guess works....
    const keyToUseRef = {};

    Object.entries(keyMap).forEach(([key, refName]) => {
      if (buttonRefs[refName]) {
        keyToUseRef[key] = buttonRefs[refName];
      } else {
        // console.log(buttonRefs[refName]);
      }
    });

    // console.log("Key to useref: ");
    // console.log(keyToUseRef);

    const handleKeyUp = (e) => {
      keydownTriggered = false;
      // console.log("key up");
      // console.log(e.key);
      let ref = keyToUseRef[e.key.toUpperCase()];
      // console.log(ref);
      if (ref) {
        // console.log(ref + " " + ref.current);
        //something exists! the magic:
        const mouseUpEvent = new MouseEvent("mouseup", {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        ref.current.dispatchEvent(mouseUpEvent);
      }
    };

    const handleKeyDown = (e) => {
      if (!keydownTriggered) {
        keydownTriggered = true;
      } else {
        //This is to prevent multiple key triggers
        return;
      }

      // console.log("key down");
      // console.log(e.key);
      let ref = keyToUseRef[e.key.toUpperCase()];
      // console.log(ref);
      if (ref) {
        //something exists! the magic:
        const mouseDownEvent = new MouseEvent("mousedown", {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        ref.current.dispatchEvent(mouseDownEvent);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    // console.log(buttonRefs);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
};

{
  /*export const useKeyMappingsFWUI = (keyMap, handlers, buttonRefs) => {
  console.log("Running useKeyMappingsHook");
  const [keyState, setKeyState] = useState({});
  useEffect(() => {
    const handleKeyDown = (event) => {
      const action = keyMap[event.key.toUpperCase()];


      if (action && handlers[action] && !keyState[event.key.toUpperCase()]) {
        buttonRefs[action].current.classList.add('active');
        handlers[action]();
      }
      setKeyState((prevKeyState) => ({
        ...prevKeyState,
        [event.key.toUpperCase()]: true,
      }));


    };
    const handleKeyUp = (event) => {
      const action = keyMap[event.key.toUpperCase()];

      if (action && handlers[action]) {
        buttonRefs[action].current.classList.remove('active');
        handlers[action]();


        setKeyState((prevKeyState) => ({
          ...prevKeyState,
          [event.key.toUpperCase()]: false,
        }));
      }

    };


    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);


    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);


    };
  }, [keyMap, handlers, buttonRefs, keyState]);


  useEffect(() => {
    const keysPressed = Object.keys(keyState).filter((key) => keyState[key]);
    if (keysPressed.length === 0) {
      sendData(M_IP, M_PORT, { command: 'stopcar' });
    }
  }, [keyState]);
};
*/
}
