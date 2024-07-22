// useGlobalKeyListener.js
import React from "react";
import { HotKeys } from "react-hotkeys";

const keyMap = {
  CAM_SERVO_LEFT: "j",
  CAM_SERVO_CENTER: "k",
  CAM_SERVO_RIGHT: "l",
};

const handlers = {
  CAM_SERVO_LEFT: () => console.log('Action triggered (key "J")'),
  CAM_SERVO_CENTER: () => console.log('Action triggered (key "K")'),
  CAM_SERVO_RIGHT: () => console.log('Action triggered (key "L")'),
};

export const KeyMappingsFWUI = ({ children }) => {
  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      {children}
    </HotKeys>
  );
};
