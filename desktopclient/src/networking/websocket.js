// implementation of dgram
// This shouldn't be here...
const dgram = require("dgram");
//don't hardcode!!
// const sip = "10.147.18.228";
// const sport = 9696;

const client = dgram.createSocket("udp4");

export function sendData(C_IP, C_PORT, data) {
  console.log(`sendData: status is: ${C_IP}, ${C_PORT}`);
  data = { command: data.command, value: data?.value };
  //port and ip are backward...?
  client.send(Buffer.from(JSON.stringify(data)), C_PORT, C_IP, (err) => {
    if (err) console.error("Error sending data:", err);
  });
}

//hopefully this doesn't break anything
client.bind(5501, "10.147.18.171", () => {
  console.log("UDP Server listening on port 5501");
});

// Handling incoming messages
client.on("message", (msg, rinfo) => {
  console.log(`Received message from ${rinfo.address}:${rinfo.port}: ${msg}`);
});
