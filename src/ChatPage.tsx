import { ReactElement, useEffect, useRef, useState } from "react";

import "./ChatPage.css";
import { Chat } from "./components/Chat";
import ProfileMessage from "./components/Profile-Message";
import { UserI } from "./props/user";
import Message from "./props/message";
import MessageI from "./props/message";
import getSocket from "./socket";

function ChatPage({ selfUser }: { selfUser: UserI }) {
  let mounted = false;
  //const [fooEvents, setFooEvents] = useState([]);
  const [pMessages, setPMessages] = useState(null as MessageI[] | null);
  const [users, setUsers] = useState([] as UserI[]);
  const [currentChatUser, setCurrentChatUser] = useState({
    id: "general",
    name: "General",
    profilePictureUrl:
      "https://cdn2.iconfinder.com/data/icons/colored-simple-circle-volume-01/128/circle-flat-general-54205e542-512.png",
  } as UserI);

  const { jwt } = localStorage;
  if (!jwt) {
    const win: Window = window;
    win.location = "/login";
  }
  const [socket] = useState(getSocket(jwt));
  const [isConnected, setIsConnected] = useState(socket.connected);

  //Scroll down each message
  const bottomChatElement = useRef(null as null | HTMLDivElement);

  let usersElements: ReactElement[] = [];
  for (const user of users) {
    usersElements.push(
      <ProfileMessage user={user} customClickEvent={changeChat} />
    );
  }

  useEffect(() => {
    mounted = true;

    async function getMessagesAndUsers() {
      const newM = await new Promise<Message[]>(async (res) => {
        await new Promise((res) => {
          setTimeout(() => res(true), 1000);
        });
        return res([]);
      });

      const users = await fetch("/users").then((res) => res.json());

      if (mounted) {
        setPMessages(newM);
        setUsers(users);
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
      console.log("new");
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

    getMessagesAndUsers();
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

            {...usersElements}
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
