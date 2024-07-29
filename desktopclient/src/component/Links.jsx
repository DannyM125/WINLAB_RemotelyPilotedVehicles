import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
const { Header } = Layout;
const navlinks = [
  {
    key: crypto.randomUUID(),
    label: <Link to={"/MecanumUI"}>Mecanum</Link>,
  },
  {
    key: crypto.randomUUID(),
    label: <Link to={"/FourWheelUI"}>Four Wheel UI</Link>,
  },
  {
    key: crypto.randomUUID(),
    label: <Link to={"/SettingsUI"}>Settings</Link>,
  },
];
export default function Links() {
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
        style={{ flex: 1, minWidth: 0 }}
      ></Menu>
    </Header>
  );
}
