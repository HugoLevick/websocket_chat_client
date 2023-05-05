import { UserI } from "./user";

export default interface ProfileMessageProps {
  user: UserI;
  customClickEvent: (user: UserI) => void;
}
