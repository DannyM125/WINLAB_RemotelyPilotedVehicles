import React, { useState, useEffect } from "react";
import { ErrorLoading, VideoLoading } from "../component/Loading";
import { openWarning } from "../App";
import { Button, Flex } from "antd";
let debounce = require("lodash/debounce");
const ping = require("ping");
const Stream = ({ IP, PORT }) => {
  console.log(`${IP}, ${PORT}`);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleRetry = () => {
    // console.log("retrying...");
    loadVideo();
    setError(false);
    setLoading(true);
  };

  const handleError = () => {
    setTimeout(() => {
      openWarning("Error connecting to the stream."); //Error connecting to the stream.
    }, 0);
    setError(true);
  };

  const loadImageWithTimeout = (src, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      let timeoutId;

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error("Image failed to load"));
      };
      //Creating a timeout -->
      timeoutId = setTimeout(() => {
        img.onerror = null; // Prevents multiple timeout errors
        reject(new Error("Image loading timed out"));
      }, timeout);

      img.src = src;
    });
  };

  const loadVideo = () => {
    loadImageWithTimeout(`http://${IP}:${PORT}/stream.mjpg`)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        handleError();
      });
  };

  //Run to intially load video
  useEffect(() => {
    loadVideo();
    return () => {
      setError(false);
      setLoading(true);
    };
  }, []);
  //run use effect on demount to get rid of unneccessary things

  if (error) {
    return <ErrorLoading handleErrorLoading={debounce(handleRetry, 300)} />;
  }

  if (loading) {
    return <VideoLoading />;
  }

  return (
    <Flex vertical gap="15px">
      <img
        src={`http://${IP}:${PORT}/stream.mjpg`}
        alt="Stream"
        style={{ maxWidth: "100%", height: "auto", userSelect: "none" }}
        onError={handleError}
      />
      <Button
        key={crypto.randomUUID()}
        onClick={handleRetry}
        style={{ width: "200px", margin: "0 auto" }}
      >
        Retry
      </Button>
    </Flex>
  );
};

export default Stream;
