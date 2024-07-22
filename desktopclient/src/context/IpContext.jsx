import React, { createContext, useState, useContext } from "react";

const IpContext = createContext();

//When creating context you need two export two things..

//The provider
export const IpProvider = ({ children }) => {
  const [ipAndPort, setIpAndPort] = useState(["10.147.18.228", 9696]);

  return (
    <IpContext.Provider value={{ ipAndPort, setIpAndPort }}>
      {children}
    </IpContext.Provider>
  );
};

//And the the consumer (as a hook?)
export const useIp = () => useContext(IpContext);
