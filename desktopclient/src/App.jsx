import React, { useEffect, useState, createContext, useContext } from "react";
import { Layout, message } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FourWheelUI from "./pages/FourWheelUI";
import MecanumUI from "./pages/MecanumUI";
import Links from "./component/Links";
import Settings from "./pages/Settings";
import { SettingsProvider } from "./context/SettingsContext";
const debounce = require("lodash/debounce");

export let openWarning;

function AppContent() {
  const [messageApi, contextHolder] = message.useMessage();
  openWarning = (text) => {
    messageApi.open({
      type: "error",
      content: text,
    });
  };
  return (
    <>
      {contextHolder}
      <Links />
      <div className="page">
        <Routes>
          <Route path="/FourWheelUI" element={<FourWheelUI />} />
          <Route path="/MecanumUI" element={<MecanumUI />} />
          <Route path="/SettingsUI" element={<Settings />} />
          <Route path="/" element={<FourWheelUI />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <SettingsProvider>
        <Layout>
          <AppContent />
        </Layout>
      </SettingsProvider>
    </Router>
  );
}
