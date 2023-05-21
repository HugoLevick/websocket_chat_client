import { useEffect, useRef, useState } from "react";

import "./ChatPage.css";
import { Chat } from "./components/Chat";
import ProfileMessage from "./components/Profile-Message";
import { UserI } from "./props/user";
import Message from "./props/message";
import MessageI from "./props/message";
import getRoomSocket from "./socket";
("./socket");

function ChatPage({ selfUser }: { selfUser: UserI }) {
  const { jwt } = localStorage;
  if (!jwt) {
    const win: Window = window;
    win.location = "/login";
  }
  let mounted = false;
  //const [fooEvents, setFooEvents] = useState([]);
  const [pMessages, setPMessages] = useState([] as MessageI[]);
  const [currentChatUser, setCurrentChatUser] = useState({
    id: "general",
    name: "General",
    profilePictureUrl:
      "https://cdn2.iconfinder.com/data/icons/colored-simple-circle-volume-01/128/circle-flat-general-54205e542-512.png",
  } as UserI);

  //Socket
  const [socket, setSocket] = useState(getRoomSocket(jwt));
  const [isConnected, setIsConnected] = useState(socket.connected);
  //Scroll down each message
  const bottomChatElement = useRef(null as null | HTMLDivElement);

  useEffect(() => {
    mounted = true;

    async function getMessages() {
      const newM = await new Promise<Message[]>(async (res) => {
        await new Promise((res) => {
          setTimeout(() => res(true), 100);
        });

        return res([]);
      });

      if (mounted) {
        setPMessages(newM);
      }
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function handleNewMessage(newMessage: MessageI) {
      //Mostrar el mensaje
      if (newMessage.sentBy.id === currentChatUser?.id) {
        setPMessages((pMessages) => [...pMessages, newMessage]);
      }
    }

    function handleGeneralMessage(newMessage: MessageI) {
      //Mostrar el mensaje
      if (currentChatUser.id === "general") {
        setPMessages((pMessages) => [...pMessages, newMessage]);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-message", handleNewMessage);
    socket.on("general-message", handleGeneralMessage);
    socket.on("error", (err) => {
      alert(err);
    });
    socket.connect();

    getMessages();
    return () => {
      mounted = false;
      socket.disconnect();
    };
  }, [currentChatUser, mounted]);

  function changeChat(user: UserI) {
    if (user.id !== currentChatUser.id) {
      setPMessages([]);
      setCurrentChatUser(user);
      setSocket(getRoomSocket(jwt, user.id));
    }
  }
  return (
    <>
      <h1>{isConnected ? "Conectado" : "Desconectado"}</h1>
      <div className="container clearfix">
        <div className="people-list" id="people-list">
          <div className="search">
            <input type="text" placeholder="search" />
            <i className="fa fa-search"></i>
          </div>
          <ul className="list">
            <ProfileMessage
              user={{
                id: "general",
                name: "General",
                color: "#FFFFFF",
                profilePictureUrl:
                  "https://cdn2.iconfinder.com/data/icons/colored-simple-circle-volume-01/128/circle-flat-general-54205e542-512.png",
              }}
              customClickEvent={changeChat}
            />

            <ProfileMessage
              user={{
                id: "6",
                name: "Juano",
                color: "#FFFFFF",
                profilePictureUrl:
                  "https://static3.mujerhoy.com/www/multimedia/202202/14/media/cortadas/pilar-tobella-madre-rosalia-kDDH-U160947660148ILC-624x624@MujerHoy.jpg",
              }}
              customClickEvent={changeChat}
            />

            <ProfileMessage
              user={{
                id: "7",
                name: "Hugo",
                color: "#FFFFFF",
                profilePictureUrl:
                  "https://m.media-amazon.com/images/I/914KvMZNh8L._AC_SL1500_.jpg",
              }}
              customClickEvent={changeChat}
            />
          </ul>
        </div>

        <Chat
          currentChatUser={currentChatUser}
          selfUser={selfUser}
          previousMessages={pMessages}
          socket={socket}
          bottomChatElement={bottomChatElement}
        />
      </div>
    </>
  );
}

export default ChatPage;
