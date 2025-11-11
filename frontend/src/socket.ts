import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // replace with your backend URL

// Payloads from server
export interface MessagePayload {
  content: string;
  senderId: string;
  roomId: string;
  // other fields from DB are ignored
}

// Events emitted by server and listened by client
export interface ServerToClientEvents {
  "user-joined": (data: { userId: string; roomId: string }) => void;
  "user-left": (data: { userId: string; roomId: string }) => void;
  "new-message": (data: MessagePayload) => void;
  error: (data: { message: string }) => void;
  // connection errors are special socket.io events; no typing required here
}

// Events emitted by client and consumed by server
export interface ClientToServerEvents {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  "join-room": (data: { roomId: string }, callback?: (res: any) => void) => void;
  "leave-room": (data: { roomId: string }) => void;
  "send-message": (data: { roomId: string; content: string }) => void;
}

// Create a typed socket instance with manual connect
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  SOCKET_URL,
  {
    autoConnect: false,
  }
);

// Utility: connect with a token (auth comes from user input)
export function connectWithToken(token: string) {
  (socket as unknown as { auth: Record<string, unknown> }).auth = { token };
  if (socket.connected) {
    socket.disconnect();
  }
  socket.connect();
}
