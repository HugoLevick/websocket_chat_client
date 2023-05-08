import MessageProps from "../props/message-props";

function Message({ message, color, self }: MessageProps) {
  //prettier-ignore
  return (
    <>
      <li className="clearfix">
        <div
          className={`message-data ${self ? "align-right" : ""}`}
        >
          {self ? (
            <>
              <span className="message-data-time">
                {message.sentAt.toLocaleString()}
              </span>
              <span className="message-data-name">{message.sentBy.name}</span>
              <i className="fa fa-circle me"></i>
            </>
          ) : (
            <>
              <span className="message-data-name">
                <i className="fa fa-circle online" style={{color}}></i> {message.sentBy.name}
              </span>
              <span className="message-data-time">
                {message.sentAt.toLocaleString()}
              </span>
            </>
          )}
        </div>
        <div
          className={`message ${
            self ? "float-right my-message" : "other-message"
          }`}
        >
          {message.content}
        </div>
      </li>
    </>
  );
}

export default Message;
