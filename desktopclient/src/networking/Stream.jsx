import React, { useState, useEffect } from "react";
import { message } from "antd";
import { ErrorLoading, VideoLoading } from "../component/Loading";
let debounce = require("lodash/debounce");

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
      message.error("Error connecting to the stream.");
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
        // console.error(error);
        handleError();
      });
  };

  useEffect(() => {
    loadVideo();
    return () => {
      setError(false);
      setLoading(true);
    };
  }, []);

  if (error) {
    return <ErrorLoading handleErrorLoading={debounce(handleRetry, 300)} />;
  }

  if (loading) {
    return <VideoLoading />;
  }

  return (
    <div>
      <img
        src={`http://${IP}:${PORT}/stream.mjpg`}
        alt="Stream"
        style={{ maxWidth: "100%", height: "auto" }}
        onError={handleError}
      />
    </div>
  );
};

export default Stream;
