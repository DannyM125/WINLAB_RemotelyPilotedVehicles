import React, { useRef } from "react";
import Stream from "../networking/Stream";
import { sendData } from "../networking/websocket";
import { Image, Col, Row, Grid, Button } from "antd";
import "./mecanum.css";
import Ping from "../component/Ping.jsx";
import { useKeyMappings } from "../hooks/useKeyMappings";
import mecanumDiagramImage from "../assets/mecanumdiagram.png";
import {
  RotateRightOutlined,
  RotateLeftOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { M_CAM_PORT, M_IP, M_PORT } from "../../../constants";
const keyMap = {
  A: "LEFT",
  W: "FRONT",
  S: "BACK",
  D: "RIGHT",
  J: "ROTATE_CC",
  K: "ROTATE_C",
  Q: "DIAG_FL",
  E: "DIAG_FR",
  Z: "DIAG_BL",
  X: "DIAG_BR",
};

export default function MecanumUI() {
  //As a hack, im going to combine the objects
  const buttonRefs = {
    FRONT: useRef(null),
    BACK: useRef(null),
    LEFT: useRef(null),
    RIGHT: useRef(null),
    ROTATE_CC: useRef(null),
    ROTATE_C: useRef(null),
    DIAG_FL: useRef(null),
    DIAG_FR: useRef(null),
    DIAG_BL: useRef(null),
    DIAG_BR: useRef(null),
  };

  useKeyMappings(keyMap, buttonRefs);

  return (
    <>
      <Row>
        <Col span={12}>
          <div className="pingMecanum">
            <Ping IP={M_IP} />
          </div>
          <div className="adaptive-image-container">
            <Image className="adaptive-image" src={mecanumDiagramImage} />
            <div className="buttons-overlay">
              <div className="forward-button">
                <Button
                  ref={buttonRefs.FRONT}
                  icon={<ArrowUpOutlined />}
                  type="primary"
                  onMouseDown={() => {
                    // console.log("mousedown");
                    sendData(M_IP, M_PORT, { command: "forward" });
                  }}
                  onMouseUp={() => {
                    sendData(M_IP, M_PORT, { command: "stopcar" });
                  }}
                ></Button>
              </div>
              <div className="backward-button">
                <Button
                  ref={buttonRefs.BACK}
                  type="primary"
                  icon={<ArrowDownOutlined />}
                  onMouseDown={() => {
                    sendData(M_IP, M_PORT, { command: "backward" });
                  }}
                  onMouseUp={() => {
                    sendData(M_IP, M_PORT, { command: "stopcar" });
                  }}
                ></Button>
              </div>
              <div className="left-button">
                <Button
                  ref={buttonRefs.LEFT}
                  icon={<ArrowLeftOutlined />}
                  type="primary"
                  onMouseDown={() => {
                    sendData(M_IP, M_PORT, { command: "strafeleft" });
                  }}
                  onMouseUp={() => {
                    sendData(M_IP, M_PORT, { command: "stopcar" });
                  }}
                ></Button>
              </div>
              <div className="right-button">
                <Button
                  type="primary"
                  ref={buttonRefs.RIGHT}
                  icon={<ArrowRightOutlined />}
                  onMouseDown={() => {
                    sendData(M_IP, M_PORT, { command: "straferight" });
                  }}
                  onMouseUp={() => {
                    sendData(M_IP, M_PORT, { command: "stopcar" });
                  }}
                ></Button>
              </div>
              <div className="cc">
                <Button
                  ref={buttonRefs.ROTATE_CC}
                  icon={<RotateLeftOutlined />}
                  type="primary"
                  onMouseDown={() => {
                    sendData(M_IP, M_PORT, {
                      command: "rotate_counterclockwise",
                    });
                  }}
                  onMouseUp={() => {
                    sendData(M_IP, M_PORT, {
                      command: "stopcar",
                    });
                  }}
                ></Button>
              </div>
              <div className="c">
                <Button
                  ref={buttonRefs.ROTATE_C}
                  icon={<RotateRightOutlined />}
                  type="primary"
                  onMouseDown={() => {
                    sendData(M_IP, M_PORT, { command: "rotate_clockwise" });
                  }}
                  onMouseUp={() => {
                    sendData(M_IP, M_PORT, { command: "stopcar" });
                  }}
                ></Button>
              </div>
              <div className="fl">
                <Button
                  ref={buttonRefs.DIAG_FL}
                  type="primary"
                  onMouseDown={() => {
                    sendData(M_IP, M_PORT, { command: "diagonal_fl" });
                  }}
                  onMouseUp={() => {
                    sendData(M_IP, M_PORT, { command: "stopcar" });
                  }}
                >
                  Diagonal
                </Button>
              </div>
              <div className="fr">
                <Button
                  ref={buttonRefs.DIAG_FR}
                  type="primary"
                  onMouseDown={() => {
                    sendData(M_IP, M_PORT, { command: "diagonal_fr" });
                  }}
                  onMouseUp={() => {
                    sendData(M_IP, M_PORT, { command: "stopcar" });
                  }}
                >
                  Diagonal
                </Button>
              </div>

              <div className="rl">
                <Button
                  ref={buttonRefs.DIAG_BL}
                  type="primary"
                  onMouseDown={() => {
                    sendData(M_IP, M_PORT, { command: "diagonal_rl" });
                  }}
                  onMouseUp={() => {
                    sendData(M_IP, M_PORT, {
                      command: "stopcar",
                    });
                  }}
                >
                  Diagonal
                </Button>
              </div>

              <div className="rr">
                <Button
                  ref={buttonRefs.DIAG_BR}
                  type="primary"
                  onMouseDown={() => {
                    sendData(M_IP, M_PORT, {
                      command: "diagonal_rr",
                    });
                  }}
                  onMouseUp={() => {
                    sendData(M_IP, M_PORT, {
                      command: "stopcar",
                    });
                  }}
                >
                  Diagonal
                </Button>
              </div>
            </div>
          </div>
        </Col>

        <Col span={12}>
          <div className="adaptive-image-container">
            <Stream IP={M_IP} PORT={M_CAM_PORT} />
          </div>
        </Col>
      </Row>
    </>
  );
}
