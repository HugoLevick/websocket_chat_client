export default interface ProfileMessageI {
  user: {
    name: string;
    status: "online" | "offline";
    profilePictureUrl?: string;
  };
}
