import { io } from "socket.io-client";

const apiHost = import.meta.env.VITE_API_HOST;

export default function getRoomSocket(room: string = "general") {
  const options = {
    transports: ["websocket"],
    autoConnect: false,
    query: {
      roomName: `chat#${room}`,
    },
    auth: {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6ImdnIiwicHJvZmlsZVBpY3R1cmVVcmwiOiJodHRwczovL3hpYW9taW14LnZ0ZXhhc3NldHMuY29tL2FycXVpdm9zL2lkcy8xNTc2MzgtODAwLWF1dG8_dj02Mzc4OTAyOTk4OTU1MzAwMDAmd2lkdGg9ODAwJmhlaWdodD1hdXRvJmFzcGVjdD10cnVlIiwiY29sb3IiOiIjNjUzMWQyIiwiaWF0IjoxNjgzMjQwOTk4fQ.Prdcc34dFLnRBal0iFAdmMoVRns74T7O2pTS6H1AdqA",
    },
  };

  return io(`${apiHost}`, options);
}
