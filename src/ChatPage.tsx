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

  let onlineUsersElements: ReactElement[] = [];
  let offlineUsersElements: ReactElement[] = [];
  for (const onlineUser of users.online) {
    if (onlineUser.id !== selfUser.id)
      onlineUsersElements.push(
        <ProfileMessage
          user={onlineUser}
          customClickEvent={changeChat}
          key={onlineUser.id}
          online={true}
        />
      );
  }

  for (const offlineUser of users.offline) {
    if (offlineUser.id !== selfUser.id)
      offlineUsersElements.push(
        <ProfileMessage
          user={offlineUser}
          customClickEvent={changeChat}
          key={offlineUser.id}
          online={false}
        />
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
        toast("Nuevo mensaje de " + newMessage.sentBy.name, {
          onClick: () => {
            changeChat(newMessage.sentBy);
          },
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

    function handleOnlineUser(user: UserI) {
      setUsers((currentUsers) => {
        const newUsers = { ...currentUsers };
        newUsers.online.push(user);
        const wasOffline = newUsers.offline.findIndex((u) => u.id === user.id);
        if (wasOffline !== -1) newUsers.offline.splice(wasOffline, 1);
        return newUsers;
      });
    }

    function handleOfflineUser(user: UserI) {
      console.log("offline");
      setUsers((currentUsers) => {
        const newUsers = { ...currentUsers };
        newUsers.offline.push(user);
        const wasOnline = newUsers.online.findIndex((u) => u.id === user.id);
        if (wasOnline !== -1) newUsers.online.splice(wasOnline, 1);
        return newUsers;
      });
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
    socket.on("online-user", handleOnlineUser);
    socket.on("offline-user", handleOfflineUser);
    socket.on("invalid-token", handleInvalidToken);
    socket.on("error", (err) => {
      alert(err);
    });

    getMessagesAndUsers();
    return () => {
      socket
        .off("connect", onConnect)
        .off("disconnect")
        .off("receive-message")
        .off("general-message")
        .off("online-user")
        .off("offline-user")
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
          <ul className="list">
            <ProfileMessage
              user={{
                id: "general",
                name: "General",
                color: "#FFFFFF",
                profilePictureUrl:
                  "https://cdn2.iconfinder.com/data/icons/colored-simple-circle-volume-01/128/circle-flat-general-54205e542-512.png",
              }}
              online={true}
              customClickEvent={changeChat}
            />
            {onlineUsersElements}
            {offlineUsersElements}
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
