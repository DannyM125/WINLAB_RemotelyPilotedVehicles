import React from "react";
import { Button } from "antd";
import { sendData } from "../networking/websocket";
export default function Default() {
  return (
    <>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData("forward");
        }}
        onMouseUp={(e) => {
          sendData("stopcar");
        }}
      >
        Forward
      </Button>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData("backward");
        }}
        onMouseUp={(e) => {
          sendData("stopcar");
        }}
      >
        Backward
      </Button>
    </>
  );
}
