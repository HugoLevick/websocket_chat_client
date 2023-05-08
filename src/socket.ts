import { io } from "socket.io-client";

const apiHost = import.meta.env.VITE_API_HOST;

export default function getRoomSocket(token: string, room: string = "general") {
  const options = {
    transports: ["websocket"],
    autoConnect: false,
    query: {
      roomName: `chat#${room}`,
    },
    auth: {
      token,
    },
  };

  return io(`${apiHost}`, options);
}
