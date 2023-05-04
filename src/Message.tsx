import MessageI from "./interfaces/message.interface";

function Message(data: MessageI) {
  //prettier-ignore
  return (
    <>
      <li className="clearfix">
        <div
          className={`message-data ${data.message.self ? "align-right" : ""}`}
        >
          {data.message.self ? (
            <>
              <span className="message-data-time">
                {data.message.sentAt.toLocaleString()}
              </span>
              <span className="message-data-name">{data.message.sentBy}</span>
              <i className="fa fa-circle me"></i>
            </>
          ) : (
            <>
              <span className="message-data-name">
                <i className="fa fa-circle online"></i> {data.message.sentBy}
              </span>
              <span className="message-data-time">
                {data.message.sentAt.toLocaleString()}
              </span>
            </>
          )}
        </div>
        <div
          className={`message ${
            data.message.self ? "float-right my-message" : "other-message"
          }`}
        >
          {data.message.content}
        </div>
      </li>
    </>
  );
}

export default Message;
