import { ChangeEvent, useRef, useState } from "react";
import { ChatProps } from "../props/chat-props";
import Message from "./Message";

export const Chat = function ({
  previousMessages,
  currentChatUser,
  selfUser,
  socket,
  bottomChatElement,
}: ChatProps) {
  const [message, setMessage] = useState("");
  const messageElement = useRef(null as HTMLTextAreaElement | null);

  const messageElements = previousMessages.map((m, i) => (
    <Message
      message={{
        content: m.content,
        sentAt: new Date(m.sentAt),
        sentBy: m.sentBy,
      }}
      color={m.sentBy.color}
      self={m.sentBy.id == selfUser.id}
      key={i}
    />
  ));
  return (
    <>
      <div className="chat">
        <div className="chat-header clearfix">
          <img
            src={currentChatUser?.profilePictureUrl}
            alt="avatar"
            className="pfp pfp-m"
          />

          <div className="chat-about">
            <div className="chat-with">Chat con {currentChatUser?.name}</div>
            <div className="chat-num-messages">
              {messageElements.length} mensajes
            </div>
          </div>
          <i className="fa fa-star"></i>
        </div>

        <div
          className="chat-history"
          ref={(divElement) => {
            if (
              (divElement?.scrollHeight || 0) -
                (divElement?.scrollTop || 1000) <
              400
            )
              bottomChatElement.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <ul>
            {messageElements}
            <div
              style={{ float: "left", clear: "both" }}
              ref={(el) => {
                bottomChatElement.current = el;
              }}
            ></div>
          </ul>
        </div>

        <div className="chat-message clearfix">
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              socket.emit("new-message", socket.id, {
                content: message,
                toUserId: currentChatUser?.id,
              });
              if (messageElement.current) messageElement.current.value = "";
            }}
          >
            <textarea
              name="message-to-send"
              id="message-to-send"
              placeholder="Type your message"
              rows={3}
              ref={(el) => {
                messageElement.current = el;
              }}
              onInput={(event: ChangeEvent<HTMLTextAreaElement>) => {
                const newMessage = event.target.value;
                setMessage(newMessage);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault(); // prevent the default behavior of adding a new line
                  const form = event.currentTarget.closest("form");
                  if (form) form.requestSubmit(); // submit the form
                }
              }}
            ></textarea>
            <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
            <i className="fa fa-file-image-o"></i>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </>
  );
};
