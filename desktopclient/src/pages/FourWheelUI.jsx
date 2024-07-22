import React from "react";
import { Button, Slider, Layout, Menu } from "antd";
import { sendData } from "../networking/websocket";
import { useIp } from "../context/IpContext";
import { useKeyMappingsFWUI } from "../hooks/useKeyMappingsFWUI";
import Stream from "../networking/Stream";

//Todo: unify ui...
const keyMap = {
  J: "CAM_SERVO_LEFT",
  K: "CAM_SERVO_CENTER",
  L: "CAM_SERVO_RIGHT",
  I: "CAR_SERVO_LEFT",
  O: "CAR_SERVO_CENTER",
  P: "CAR_SERVO_RIGHT",
};

const handlers = {
  CAM_SERVO_LEFT: () => console.log('Action triggered (key "J")'),
  CAM_SERVO_CENTER: () => console.log('Action triggered (key "K")'),
  CAM_SERVO_RIGHT: () => console.log('Action triggered (key "L")'),
};
export default function FourWheelUI() {
  //Run hook at the very top
  useKeyMappingsFWUI(keyMap, handlers);
  const FW_IP = "10.147.18.228";

  //this is local. DONT DELETE THIS! WE WILL MAKE A CONFIG FILE THAT WILL STORE IPS! if you need a different IP address COMMENT THIS ONE OUT AND USE SOMEHTHING ELSE!!!!!! thank you
  // const FW_IP = "10.61.1.178";
  const FW_PORT = 9696;
  const FW_VIDEO_PORT = 9000;

  return (
    <>
      <Layout>
        <Button
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
        <Button
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
        <span>Cam servo</span>
        <Slider
          min={0}
          max={180}
          defaultValue={90}
          onChange={(e) => {
            sendData(FW_IP, FW_PORT, { value: e, command: "steercam" });
          }}
        />
        {/* Video Stream! */}
        <Stream PORT={FW_VIDEO_PORT} IP={FW_IP} />
        <span>Steering servo</span>
        <Slider
          min={60}
          max={180}
          defaultValue={120}
          onChange={(e) => {
            sendData(FW_IP, FW_PORT, { value: e, command: "steercar" });
          }}
        />
      </Layout>
    </>
  );
}
