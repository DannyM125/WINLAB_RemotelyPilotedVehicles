const ping = require("ping");
import { useEffect, useState } from "react";
import React from "react";

export default function Ping({ IP }) {
  const [pingVal, setPingVal] = useState("Pinging...");
  let timeout;

  async function streamPing(host) {
    // console.log("stream ping");
    try {
      console.log("ping...");
      const res = await ping.promise.probe(host, { timeout: 5 });
      if (res.alive) {
        console.log(`Ping: ${res.time} ms`);
        setPingVal(res.time);
      } else {
        console.log(`failed`);
        setPingVal("Cant reach");
      }
    } catch (err) {
      console.error(`Ping error:`, err);
    }
    timeout = setTimeout(streamPing, 1000, host);
  }
  //only run when IP changes
  useEffect(() => {
    //I don't know if you have to use a useEffect with this...

    console.log("main useEffect call");
    streamPing(IP);

    //For now use this
    // streamPing("127.0.0.1");

    return () => {
      clearTimeout(timeout);
    };
  }, [IP]);
  return (
    <div style={{ userSelect: "none" }}>
      <span style={{ fontWeight: 800 }}>Connection Delay:</span> {pingVal}ms
    </div>
  );
}
