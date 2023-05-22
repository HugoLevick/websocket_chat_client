import { useEffect, useRef, useState } from "react";

import "./ChatPage.css";
import { Chat } from "./components/Chat";
import ProfileMessage from "./components/Profile-Message";
import { UserI } from "./props/user";
import Message from "./props/message";
import MessageI from "./props/message";
import { Socket } from "socket.io-client";

function ChatPage({ selfUser, socket }: { selfUser: UserI; socket: Socket }) {
  let mounted = false;
  //const [fooEvents, setFooEvents] = useState([]);
  const [pMessages, setPMessages] = useState(null as MessageI[] | null);
  const [currentChatUser, setCurrentChatUser] = useState({
    id: "general",
    name: "General",
    profilePictureUrl:
      "https://cdn2.iconfinder.com/data/icons/colored-simple-circle-volume-01/128/circle-flat-general-54205e542-512.png",
  } as UserI);
  const [isConnected, setIsConnected] = useState(socket.connected);
  //Scroll down each message
  const bottomChatElement = useRef(null as null | HTMLDivElement);

  useEffect(() => {
    mounted = true;

    async function getMessages() {
      const newM = await new Promise<Message[]>(async (res) => {
        await new Promise((res) => {
          setTimeout(() => res(true), 1000);
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
      if (newMessage.sentBy.id === currentChatUser.id) {
        setPMessages((pMessages) => {
          if (pMessages) return [...pMessages, newMessage];
          else return [newMessage];
        });
      }
    }

    function handleGeneralMessage(newMessage: MessageI) {
      //Mostrar el mensaje
      if (currentChatUser.id === "general") {
        console.log("new");
        setPMessages((pMessages) => {
          if (pMessages) return [...pMessages, newMessage];
          else return [newMessage];
        });
      }
    }

    function handleInvalidToken() {
      sessionStorage.removeItem("jwt");
      alert("Por favor, vuelve a iniciar sesión");
      const w: Window = window;
      w.location = "/login";
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-message", handleNewMessage);
    socket.on("general-message", handleGeneralMessage);
    socket.on("invalid-token", handleInvalidToken);
    socket.on("error", (err) => {
      alert(err);
    });

    getMessages();
    return () => {
      socket
        .off("connect")
        .off("disconnect")
        .off("receive-message")
        .off("general-message")
        .off("invalid-token")
        .off("error");
      mounted = false;
    };
  }, [currentChatUser, mounted, isConnected]);

  function changeChat(user: UserI) {
    if (user.id !== currentChatUser.id) {
      setPMessages(null);
      setCurrentChatUser(user);
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
