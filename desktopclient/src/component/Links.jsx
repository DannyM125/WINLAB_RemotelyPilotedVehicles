import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { useLocation } from "react-router-dom";
const { Header } = Layout;
const navlinks = [
  {
    key: 1,
    label: <Link to={"/MecanumUI"}>Mecanum</Link>,
  },
  {
    key: 2,
    label: <Link to={"/FourWheelUI"}>Four Wheel UI</Link>,
  },
  {
    key: 3,
    label: <Link to={"/SettingsUI"}>Settings</Link>,
  },
];
export default function Links() {
  const location = useLocation();
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        width: "calc(100% + 40px)",
        marginLeft: "-20px",
        marginTop: "-8px",
      }}
    >
      <Menu
        items={navlinks}
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        // defaultOpenKeys={["sub1"]}
        style={{ flex: 1, minWidth: 0 }}
      ></Menu>
    </Header>
  );
}
