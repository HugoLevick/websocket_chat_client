import { Socket } from "socket.io-client";
import MessageI from "./message";
import { UserI } from "./user";

export interface ChatProps {
  user?: UserI;
  selfUser: UserI;
  previousMessages: MessageI[];
  socket: Socket;
  bottomChatElement:
    | React.MutableRefObject<HTMLDivElement>
    | React.MutableRefObject<null>;
}
