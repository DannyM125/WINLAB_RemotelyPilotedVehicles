import React, { createContext, useState, useEffect, useContext } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [isMecanumDriveChecked, setIsMecanumDriveChecked] = useState(() => {
    const saved = localStorage.getItem("mecanumDriveChecked");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [isFourWheelDriveChecked, setIsFourWheelDriveChecked] = useState(() => {
    const saved = localStorage.getItem("fourWheelDriveChecked");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [cameraQuality, setCameraQuality] = useState(() => {
    const saved = localStorage.getItem("cameraQuality");
    return saved !== null ? JSON.parse(saved) : 50;
  });

  useEffect(() => {
    localStorage.setItem(
      "mecanumDriveChecked",
      JSON.stringify(isMecanumDriveChecked)
    );
  }, [isMecanumDriveChecked]);

  useEffect(() => {
    localStorage.setItem(
      "fourWheelDriveChecked",
      JSON.stringify(isFourWheelDriveChecked)
    );
  }, [isFourWheelDriveChecked]);

  useEffect(() => {
    localStorage.setItem("cameraQuality", JSON.stringify(cameraQuality));
  }, [cameraQuality]);

  return (
    <SettingsContext.Provider
      value={{
        isMecanumDriveChecked,
        setIsMecanumDriveChecked,
        isFourWheelDriveChecked,
        setIsFourWheelDriveChecked,
        cameraQuality,
        setCameraQuality,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
