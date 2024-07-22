import React, { useEffect, useState, createContext, useContext } from "react";
import { Layout } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import FourWheelUI from "./pages/FourWheelUI";
import MecanumUI from "./pages/MecanumUI";
import { useIp } from "./context/IpContext";
import Links from "./component/Links";
import { IpProvider } from "./context/IpContext";

// IP addresses and ports
// const FW_IP = "10.147.18.228";
// const FW_PORT = 9696;
// const M_IP = "10.147.17.144";
// const M_PORT = 6744;

function AppContent() {
  // let location = useLocation();
  // const { ipAndPort, setIpAndPort } = useIp(); // Access the context

  // useEffect(() => {
  //   console.log(location.pathname);
  //   switch (location.pathname) {
  //     case "/MecanumUI":
  //       setIpAndPort([M_IP, M_PORT]);
  //       break;
  //     case "/FourWheelUI":
  //       setIpAndPort([FW_IP, FW_PORT]);
  //       break;
  //     default:
  //       setIpAndPort([FW_IP, FW_PORT]);
  //       break;
  //   }
  // }, [location, setIpAndPort]);

  return (
    <>
      <Links />
      <div>
        <Routes>
          <Route path="/FourWheelUI" element={<FourWheelUI />} />
          <Route path="/MecanumUI" element={<MecanumUI />} />
          <Route path="/" element={<FourWheelUI />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <IpProvider>
        <Layout>
          <AppContent />
        </Layout>
      </IpProvider>
    </Router>
  );
}
