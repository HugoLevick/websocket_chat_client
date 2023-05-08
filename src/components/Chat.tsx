import { ChangeEvent, useState } from "react";
import { ChatProps } from "../props/chat-props";
import Message from "./Message";

export const Chat = function ({
  previousMessages,
  user,
  selfUser,
  socket,
  bottomChatElement,
}: ChatProps) {
  const [message, setMessage] = useState("");

  const messageElements = previousMessages.map((m, i) => (
    <Message
      message={{
        content: m.content,
        sentAt: new Date(),
        sentBy: m.sentBy,
      }}
      color={m.sentBy.color}
      self={m.sentBy.id === selfUser.id}
      key={i}
    />
  ));
  return (
    <>
      <div className="chat">
        <div className="chat-header clearfix">
          <img
            src={user?.profilePictureUrl}
            alt="avatar"
            className="pfp pfp-m"
          />

          <div className="chat-about">
            <div className="chat-with">Chat con {user?.name}</div>
            <div className="chat-num-messages">
              {messageElements.length} mensajes
            </div>
          </div>
          <i className="fa fa-star"></i>
        </div>

        <div className="chat-history">
          <ul>
            {messageElements}
            <div
              style={{ float: "left", clear: "both" }}
              ref={(el) => {
                bottomChatElement.current = el;
                bottomChatElement.current?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            ></div>
          </ul>
        </div>

        <div className="chat-message clearfix">
          <textarea
            name="message-to-send"
            id="message-to-send"
            placeholder="Type your message"
            rows={3}
            onInput={(event: ChangeEvent<HTMLTextAreaElement>) => {
              const newMessage = event.target.value;
              setMessage(newMessage);
            }}
          ></textarea>
          <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
          <i className="fa fa-file-image-o"></i>
          <button
            onClick={() => {
              socket.emit("new-message", socket.id, message);
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};
