import { UserI } from "./user";

export default interface MessageI {
  content: string;
  sentBy: UserI;
  sentAt: Date;
}
