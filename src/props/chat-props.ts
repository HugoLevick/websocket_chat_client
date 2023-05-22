import { Socket } from "socket.io-client";
import MessageI from "./message";
import { UserI } from "./user";

export interface ChatProps {
  currentChatUser?: UserI;
  selfUser: UserI;
  previousMessages: MessageI[] | null;
  socket: Socket;
  bottomChatElement:
    | React.MutableRefObject<HTMLDivElement>
    | React.MutableRefObject<null>;
}
