import React from "react";
import { useIp } from "../context/IpContext";
export default function Stream({ IP, PORT }) {
  console.log(`${IP}:${PORT}`);

  return (
    <div>
      {/* The port is 9000, but this might change */}
      <img
        src={`http://${IP}:${PORT}/stream.mjpg`}
        width="640"
        height="480"
        alt="Live Stream"
      />
    </div>
    // <div>
    //   <img
    //     src="http://10.61.1.234:6744/stream.mjpg"
    //     width="640"
    //     height="480"
    //     alt="Live Stream"
    //   />
    // </div>
  );
}
