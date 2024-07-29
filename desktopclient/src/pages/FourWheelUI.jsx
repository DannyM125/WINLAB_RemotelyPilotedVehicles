import React, { useRef } from "react";
import { Button, Slider, Layout, Menu } from "antd";
import { sendData } from "../networking/websocket";
import { useKeyMappings } from "../hooks/useKeyMappings";
import { Col, Row, Grid, Image } from "antd";
import Stream from "../networking/Stream.jsx";
let debounce = require("lodash/debounce");

import "./fourwheel.css";
import { FW_IP, FW_PORT, FW_VIDEO_PORT } from "../../../constants";

const keyMap = {
  W: "FRONT",
  S: "BACKWARD",
};

export default function FourWheelUI() {
  const handleSliderChange = debounce((e) => {
    sendData(FW_IP, FW_PORT, { value: e, command: "steercar" });
  }, 300);

  //Run hook at the very top
  const buttonRefs = {
    FRONT: useRef(null),
    BACKWARD: useRef(null),
  };
  useKeyMappings(keyMap, buttonRefs);

  //this is local. DONT DELETE THIS! WE WILL MAKE A CONFIG FILE THAT WILL STORE IPS! if you need a different IP address COMMENT THIS ONE OUT AND USE SOMEHTHING ELSE!!!!!! thank you
  // const FW_IP = "10.61.1.178";

  return (
    <>
      <Row>
        <Col span={10}>
          <div className="b1">
            <Button
              ref={buttonRefs.FRONT}
              type="primary"
              onMouseDown={(e) => {
                sendData(FW_IP, FW_PORT, { command: "forward" });
              }}
              onMouseUp={(e) => {
                sendData(FW_IP, FW_PORT, { command: "stopcar" });
              }}
            >
              Forward
            </Button>
          </div>
          <div className="b2">
            <Button
              ref={buttonRefs.BACKWARD}
              type="primary"
              onMouseDown={(e) => {
                sendData(FW_IP, FW_PORT, { command: "backward" });
              }}
              onMouseUp={(e) => {
                sendData(FW_IP, FW_PORT, { command: "stopcar" });
              }}
            >
              Backward
            </Button>
          </div>
          <div className="slide">
            <span>Steering/ Camera Servo </span>
            <Slider
              min={60}
              max={180}
              defaultValue={120}
              onChange={(e) => {
                handleSliderChange(e);
              }}
            />
          </div>
        </Col>

        {/* Video Stream! */}
        <Col span={14}>
          <div className="adaptive-image-container">
            <Stream PORT={FW_VIDEO_PORT} IP={FW_IP} />
          </div>
        </Col>
      </Row>
    </>
  );
}
