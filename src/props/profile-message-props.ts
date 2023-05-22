import { UserI } from "./user";

export default interface ProfileMessageProps {
  user: UserI;
  online: boolean;
  customClickEvent: (user: UserI) => void;
}
