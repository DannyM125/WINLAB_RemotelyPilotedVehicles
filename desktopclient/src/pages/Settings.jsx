import { Switch, Slider, Row, Col } from "antd";
import React, { useState } from "react";
import "./settings.css";
import { sendData } from "../networking/websocket";
import { useSettings } from "../context/SettingsContext";
import { Button, Modal } from "antd";
let debounce = require("lodash/debounce");
const M_PORT = 6744;
const M_CAM_PORT = 6744;
const M_IP = "10.147.17.144";

export default function Settings() {
  const {
    isMecanumDriveChecked,
    setIsMecanumDriveChecked,
    isFourWheelDriveChecked,
    setIsFourWheelDriveChecked,
    cameraQuality,
    setCameraQuality,
  } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const [isMecanumDriveChecked, setIsMecanumDriveChecked] = useState(false);
  // const [isFourWheelDriveChecked, setIsFourWheelDriveChecked] = useState(false);
  // const [cameraQuality, setCameraQuality] = useState(50);

  const handleMecanumDriveChange = (checked) => {
    setIsMecanumDriveChecked(checked);
    // console.log("Mecanum Drive switch checked:", checked);
    sendData(M_IP, M_PORT, {
      command: "togglesafetymode",
      value: checked,
    });
  };

  const handleFourWheelDriveChange = (checked) => {
    setIsFourWheelDriveChecked(checked);
    // console.log("Four Wheel Drive switch checked:", checked);
  };

  const handleCameraQualityChange = (value) => {
    setCameraQuality(value);
    // console.log("Camera Quality slider value:", value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleClick = () => {
    setIsModalOpen(false);
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <div className="center">
          <h2>Mecanum Drive</h2>
        </div>
        <Row justify="center" align="middle" className="switch-row">
          <Col>
            <h3>Safety Mode</h3>
          </Col>
          <Col>
            <Switch
              checked={isMecanumDriveChecked}
              onChange={handleMecanumDriveChange}
              checkedChildren="On"
              unCheckedChildren="Off"
            />
          </Col>
        </Row>
        {/* <div className="center">
          <h3>Camera Quality</h3>
          <Slider
            min={50}
            max={100}
            defaultValue={80}
            value={cameraQuality}
            onChange={debounce(handleCameraQualityChange, 300)}
            style={{ width: "80%", marginTop: "10px" }}
          />
        </div> */}
      </Col>
      <Col span={12}>
        {/* <div className="center">
          <h2>Four Wheel Drive</h2>
        </div>
        <div className="switch-container">
          <Switch
            checked={isFourWheelDriveChecked}
            onChange={handleFourWheelDriveChange}
            checkedChildren="On"
            unCheckedChildren="Off"
          />
        </div> */}
        <Button
          type="primary"
          onClick={showModal}
          style={{ marginTop: "10px" }}
        >
          Show Keyboard Shorcuts
        </Button>
        <Modal
          title="Shortcuts"
          open={isModalOpen}
          onOk={handleClick}
          onCancel={handleClick}
          onClose={handleClick}
        >
          <h3>Mecanum Shorcuts</h3>
          <div>Key W: Forward</div>
          <div>Key A: Strafe Left</div>
          <div>Key S: Backward</div>
          <div>Key D: Strafe Right</div>
          <div>Key J: Rotate Counter-clockwise</div>
          <div>Key K: Rotate Clockwise</div>
          <div>Key Q: Diagonal Frontleft</div>
          <div>Key E: Diagonal Frontright</div>
          <div>Key Z: Diagonal Backleft</div>
          <div>Key X: Diagonal Backright</div>
          <h3>Ackerman Shorcuts</h3>
          <div>Key W: Forward</div>
          <div>Key S: Backward</div>
        </Modal>
      </Col>
    </Row>
  );
}
