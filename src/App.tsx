//import { useState } from "react";
import "./App.css";
import Message from "./Message";
import ProfileMessage from "./Profile-Message";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <>
      <div className="container clearfix">
        <div className="people-list" id="people-list">
          <div className="search">
            <input type="text" placeholder="search" />
            <i className="fa fa-search"></i>
          </div>
          <ul className="list">
            <ProfileMessage
              user={{
                name: "Motomami",
                status: "online",
                profilePictureUrl:
                  "https://static3.mujerhoy.com/www/multimedia/202202/14/media/cortadas/pilar-tobella-madre-rosalia-kDDH-U160947660148ILC-624x624@MujerHoy.jpg",
              }}
            />

            <ProfileMessage
              user={{
                name: "Motopapi",
                status: "online",
                profilePictureUrl:
                  "https://m.media-amazon.com/images/I/914KvMZNh8L._AC_SL1500_.jpg",
              }}
            />
          </ul>
        </div>

        <div className="chat">
          <div className="chat-header clearfix">
            <img
              src="https://m.media-amazon.com/images/I/914KvMZNh8L._AC_SL1500_.jpg"
              alt="avatar"
              className="pfp pfp-m"
            />

            <div className="chat-about">
              <div className="chat-with">Chat with Motopapi</div>
              <div className="chat-num-messages">2 mensajes</div>
            </div>
            <i className="fa fa-star"></i>
          </div>

          <div className="chat-history">
            <ul>
              <Message
                message={{
                  content: "la rrosalia",
                  self: true,
                  sentAt: new Date(),
                  sentBy: "Motomami",
                }}
              />

              <Message
                message={{
                  content: "Eres bien chistosa motomami 😂😂.",
                  self: false,
                  sentAt: new Date(),
                  sentBy: "Motopapi",
                }}
              />
            </ul>
          </div>

          <div className="chat-message clearfix">
            <textarea
              name="message-to-send"
              id="message-to-send"
              placeholder="Type your message"
              rows={3}
            ></textarea>
            <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
            <i className="fa fa-file-image-o"></i>
            <button>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
