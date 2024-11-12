import { io } from "socket.io-client";

const apiHost = import.meta.env.VITE_API_HOST;

export default function getSocket(token: string) {
  const options = {
    transports: ["websocket"],
    autoConnect: true,
    auth: {
      token,
    },
  };

  return io(`${apiHost}`, options);
}
