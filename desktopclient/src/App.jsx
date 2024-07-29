import React, { useEffect, useState, createContext, useContext } from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FourWheelUI from "./pages/FourWheelUI";
import MecanumUI from "./pages/MecanumUI";
import Links from "./component/Links";
import Settings from "./pages/Settings";
import { SettingsProvider } from "./context/SettingsContext";
let debounce = require("lodash/debounce");

function AppContent() {
  return (
    <>
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
