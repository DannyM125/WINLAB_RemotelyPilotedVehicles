import React from "react";
import { Result, Button, Spin, Alert } from "antd";
export function ErrorLoading({ handleErrorLoading }) {
  return (
    <Result
      status="error"
      title="Stream failed to load"
      subTitle="Make sure stream is on and ip/port are correct."
      extra={[
        <Button key={crypto.randomUUID()} onClick={handleErrorLoading}>
          Retry
        </Button>,
      ]}
    ></Result>
  );
}

const contentStyle = {
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
};

const content = <div style={contentStyle} />;
export function VideoLoading() {
  return (
    <Spin tip="Loading..." size="large">
      {content}
    </Spin>
  );
}
