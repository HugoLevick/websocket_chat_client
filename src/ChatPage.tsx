import { ReactElement, useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import "./ChatPage.css";
import { Chat } from "./components/Chat";
import ProfileMessage from "./components/Profile-Message";
import { UserI } from "./props/user";
import MessageI from "./props/message";
import { Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";

function ChatPage({ selfUser, socket }: { selfUser: UserI; socket: Socket }) {
  let mounted = false;
  if (!selfUser) {
    const win: Window = window;
    win.location = "/login";
  }
  //const [fooEvents, setFooEvents] = useState([]);
  const [pMessages, setPMessages] = useState(null as MessageI[] | null);
  const [users, setUsers] = useState({
    online: [],
    offline: [],
  } as { online: UserI[]; offline: UserI[] });
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
  const [isConnected, setIsConnected] = useState(socket.connected);

  //Scroll down each message
  const bottomChatElement = useRef(null as null | HTMLDivElement);

  let usersElements: ReactElement[] = [];
  for (const onlineUser of users.online) {
    if (onlineUser.id !== selfUser.id)
      usersElements.push(
        <ProfileMessage user={onlineUser} customClickEvent={changeChat} />
      );
  }

  useEffect(() => {
    mounted = true;

    async function getMessagesAndUsers() {
      const messagesFetch = await fetch(
        `${import.meta.env.VITE_API_HOST}/users/${currentChatUser.id}/messages`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      ).then((res) => res.json());

      const newM = [];
      for (const message of messagesFetch) {
        newM.push({
          ...message,
          sentBy:
            typeof message.fromUser === "string"
              ? JSON.parse(message.fromUser)
              : message.fromUser,
        });
      }

      console.log(newM);

      const users = await fetch(`${import.meta.env.VITE_API_HOST}/users`).then(
        (res) => res.json()
      );

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
      if (
        newMessage.sentBy.id === currentChatUser.id ||
        newMessage.sentBy.id === selfUser.id
      ) {
        setPMessages((pMessages) => {
          if (pMessages) return [...pMessages, newMessage];
          else return [newMessage];
        });
      } else {
        console.log("toast");
        toast("Nuevo mensaje de " + newMessage.sentBy.name);
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
      <ToastContainer />
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
