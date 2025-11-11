import React, { useEffect, useState } from "react";
import { socket } from "./socket";

const RoomTest: React.FC = () => {
  const [roomId, setRoomId] = useState("6912ca0cdafd237ca26b6254");
  const [joined, setJoined] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // helper function
  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    // When connected
    socket.on("connect", () => {
      addLog(`✅ Connected: ${socket.id}`);
    });

    // When another user joins
    socket.on("user-joined", ({ userId, roomId }) => {
      addLog(`👤 User ${userId} joined room ${roomId}`);
    });

    // Handle error messages from server
    socket.on("error", (err) => {
      addLog(`❌ Error: ${err.message}`);
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("user-joined");
      socket.off("error");
    };
  }, []);

  const handleJoinRoom = () => {
    socket.emit("join-room", { roomId }, (response:Response) => {
      addLog(`Server Response: ${JSON.stringify(response)}`);
    });
    setJoined(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Socket.IO Room Join Test</h2>

      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
      />
      <button onClick={handleJoinRoom} disabled={joined}>
        Join Room
      </button>

      <h3>Logs:</h3>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "8px",
          minHeight: "150px",
        }}
      >
        {logs.join("\n")}
      </pre>
    </div>
  );
};

export default RoomTest;
