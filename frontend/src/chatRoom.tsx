// src/components/ChatRoom.tsx
import React, { useEffect, useState } from "react";
import { socket, connectWithToken } from "./socket";

const ChatRoom: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);
  const addMessage = (msg: string) => setMessages((prev) => [...prev, msg]);

  // --- Register socket event listeners ---
  useEffect(() => {
    socket.on("connect", () => {
      addLog(`✅ Connected to server: ${socket.id}`);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      addLog("🔌 Disconnected");
      setConnected(false);
      setJoined(false);
    });

    socket.on("user-joined", ({ userId, roomId }) => {
      addLog(`👤 User ${userId} joined room ${roomId}`);
    });

    socket.on("user-left", ({ userId, roomId }) => {
      addLog(`🚪 User ${userId} left room ${roomId}`);
    });

    socket.on("new-message", (msg) => {
      addMessage(`💬 ${msg.senderId}: ${msg.content}`);
    });

    socket.on("error", (err) => {
      addLog(`❌ Error: ${err.message}`);
    });

    // Handle auth/connection errors from middleware
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("connect_error", (err: any) => {
      addLog(`❌ Connect error: ${err?.message || "unknown error"}`);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("new-message");
      socket.off("error");
      socket.off("connect_error");
    };
  }, []);

  const handleConnect = () => {
    if (!token.trim()) {
      addLog("⚠️ Please provide a token before connecting.");
      return;
    }
    connectWithToken(token.trim());
  };

  const handleDisconnect = () => {
    if (socket.connected) {
      socket.disconnect();
    }
  };

  // --- Event Handlers ---
  const handleJoinRoom = () => {
    socket.emit("join-room", { roomId });
    setJoined(true);
    addLog(`🏠 Joined room ${roomId}`);
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room", { roomId });
    setJoined(false);
    addLog(`🚪 You left room ${roomId}`);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send-message", { roomId, content: message });
    addMessage(`🧍 You: ${message}`);
    setMessage("");
  };

  // --- UI ---
  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>💬 Realtime Chat Room Test</h2>

      {/* Token & Connection Controls */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter JWT token"
          style={{ flex: 1, padding: "8px" }}
        />
        {!connected ? (
          <button onClick={handleConnect}>Connect</button>
        ) : (
          <button onClick={handleDisconnect}>Disconnect</button>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
          style={{ flex: 1, padding: "8px" }}
        />
        {!joined ? (
          <button onClick={handleJoinRoom} disabled={!connected || !roomId.trim()}>
            Join
          </button>
        ) : (
          <button onClick={handleLeaveRoom}>Leave</button>
        )}
      </div>

      <div
        style={{
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "8px",
          minHeight: "200px",
          marginBottom: "10px",
          overflowY: "auto",
        }}
      >
        <h4>Messages:</h4>
        {messages.length === 0 ? (
          <p style={{ color: "#888" }}>No messages yet.</p>
        ) : (
          messages.map((m, i) => <div key={i}>{m}</div>)
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "8px" }}
          disabled={!joined}
        />
        <button onClick={handleSendMessage} disabled={!joined}>
          Send
        </button>
      </div>

      <h4 style={{ marginTop: "20px" }}>Logs:</h4>
      <pre
        style={{
          background: "#f8f8f8",
          padding: "10px",
          borderRadius: "8px",
          minHeight: "150px",
          overflowY: "auto",
        }}
      >
        {logs.join("\n")}
      </pre>
    </div>
  );
};

export default ChatRoom;
