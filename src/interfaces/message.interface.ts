export default interface MessageI {
  message: {
    content: string;
    self: boolean;
    sentBy: string;
    sentAt: Date;
  };
}
