import React from "react";
import { Button } from "antd";
import Stream from "../networking/Stream";
import { sendData } from "../networking/websocket";
const M_IP = "10.61.1.234";
const M_PORT = 6744;
const M_CAM_PORT = 9000;
export default function MecanumUI() {
  return (
    <>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData(M_IP, M_PORT, { command: "forward" });
        }}
        onMouseUp={(e) => {
          sendData(M_IP, M_PORT, { command: "stopcar" });
        }}
      >
        Forward
      </Button>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData(M_IP, M_PORT, { command: "backward" });
        }}
        onMouseUp={(e) => {
          sendData(M_IP, M_PORT, { command: "stopcar" });
        }}
      >
        Backward
      </Button>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData(M_IP, M_PORT, { command: "strafeleft" });
        }}
        onMouseUp={(e) => {
          sendData(M_IP, M_PORT, { command: "stopcar" });
        }}
      >
        Strafe left
      </Button>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData(M_IP, M_PORT, { command: "straferight" });
        }}
        onMouseUp={(e) => {
          sendData(M_IP, M_PORT, { command: "stopcar" });
        }}
      >
        Strafe right
      </Button>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData(M_IP, M_PORT, { command: "rotate_clockwise" });
        }}
        onMouseUp={(e) => {
          sendData(M_IP, M_PORT, { command: "stopcar" });
        }}
      >
        Rotate clockwise
      </Button>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData(M_IP, M_PORT, { command: "rotate_counterclockwise" });
        }}
        onMouseUp={(e) => {
          sendData(M_IP, M_PORT, { command: "stopcar" });
        }}
      >
        Rotate counterclockwise
      </Button>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData(M_IP, M_PORT, { command: "diagonal_fl" });
        }}
        onMouseUp={(e) => {
          sendData(M_IP, M_PORT, { command: "stopcar" });
        }}
      >
        Move Front Left Diagonal
      </Button>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData(M_IP, M_PORT, { command: "diagonal_rl" });
        }}
        onMouseUp={(e) => {
          sendData(M_IP, M_PORT, { command: "stopcar" });
        }}
      >
        Move Rear Left Diagonal
      </Button>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData(M_IP, M_PORT, { command: "diagonal_fr" });
        }}
        onMouseUp={(e) => {
          sendData(M_IP, M_PORT, { command: "stopcar" });
        }}
      >
        Move Front Right Diagonal
      </Button>
      <Button
        type="primary"
        onMouseDown={(e) => {
          sendData(M_IP, M_PORT, { command: "diagonal_rr" });
        }}
        onMouseUp={(e) => {
          sendData(M_IP, M_PORT, { command: "stopcar" });
        }}
      >
        Move Rear Right Diagonal
      </Button>
      <Stream IP={M_IP} PORT={M_CAM_PORT} />
    </>
  );
}
