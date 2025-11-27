// Smart Bat Realtime WebSocket Server

const WebSocket = require("ws");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

// Health Check
app.get("/", (req, res) => {
  res.send("SmartBat WebSocket Server Running");
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// All connected clients
let clients = [];

wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.push(ws);

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());

    // Broadcast to all dashboards
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter(c => c !== ws);
  });
});

// Render port support
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(WebSocket running on ${PORT});
});
