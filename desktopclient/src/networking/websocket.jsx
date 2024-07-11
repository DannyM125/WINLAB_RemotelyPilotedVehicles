const dgram = require("dgram");
//don't harcode!!
const ip = "10.147.18.228";
const port = 9696;
const client = dgram.createSocket("udp4");

export function sendData(data) {
  console.log("sendData: status is:", data);
  data = { command: data };
  client.send(Buffer.from(JSON.stringify(data)), port, ip, (err) => {
    if (err) console.error("Error sending data:", err);
  });
}
