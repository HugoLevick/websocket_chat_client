export interface UserI {
  id: string;
  name: string;
  status: "online" | "offline";
  profilePictureUrl?: string;
}
