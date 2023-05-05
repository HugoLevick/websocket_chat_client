import { useEffect, useState } from "react";
import "./App.css";
import { Chat } from "./components/Chat";
import ProfileMessage from "./components/Profile-Message";
import { UserI } from "./props/user";
import Message from "./props/message";

import getRoomSocket from "./socket";
import MessageI from "./props/message";
("./socket");

function App({ selfUser }: { selfUser: UserI }) {
  let mounted = false;
  //const [fooEvents, setFooEvents] = useState([]);
  const [pMessages, setPMessages] = useState([] as MessageI[]);
  const [currentChatUser, setCurrentChatUser] = useState({
    id: "general",
    name: "General",
    status: "online",
    profilePictureUrl:
      "https://cdn2.iconfinder.com/data/icons/colored-simple-circle-volume-01/128/circle-flat-general-54205e542-512.png",
  } as UserI);

  //Socket
  const [socket, setSocket] = useState(getRoomSocket());

  //console.log(socket.)

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    mounted = true;

    async function getMessages() {
      const newM = await new Promise<Message[]>(async (res) => {
        await new Promise((res) => {
          setTimeout(() => res(true), 1000);
        });

        return res([
          {
            content: "Test",
            sentAt: new Date(),
            sentBy: {
              id: "1",
              name: "Motomami",
              status: "online",
              profilePictureUrl:
                "https://static3.mujerhoy.com/www/multimedia/202202/14/media/cortadas/pilar-tobella-madre-rosalia-kDDH-U160947660148ILC-624x624@MujerHoy.jpg",
            },
          },
          {
            content: "Eres bien chistosa motomami",
            sentAt: new Date(),
            sentBy: {
              id: "2",
              name: currentChatUser.name,
              status: "online",
              profilePictureUrl:
                "https://m.media-amazon.com/images/I/914KvMZNh8L._AC_SL1500_.jpg",
            },
          },
          {
            content: "Asi somos las motomamis",
            sentAt: new Date(),
            sentBy: {
              id: "1",
              name: "Motomami",
              status: "online",
              profilePictureUrl:
                "https://static3.mujerhoy.com/www/multimedia/202202/14/media/cortadas/pilar-tobella-madre-rosalia-kDDH-U160947660148ILC-624x624@MujerHoy.jpg",
            },
          },
        ]);
      });

      if (mounted) setPMessages(newM);
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function handleNewMessage(newMessage: MessageI) {
      console.log(newMessage);
      setPMessages([...pMessages, newMessage]);
    }

    // function onFooEvent(value) {
    //   setFooEvents((previous) => [...previous, value]);
    // }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-message", handleNewMessage);
    socket.connect();
    console.log(socket.auth);
    //socket.on("foo", onFooEvent);

    getMessages();
    return () => {
      mounted = false;
      socket.disconnect();
      //socket.off("foo", onFooEvent);
    };
  }, [currentChatUser, mounted]);

  function changeChat(user: UserI) {
    if (user.id !== currentChatUser.id) {
      setPMessages([]);
      setCurrentChatUser(user);
      setSocket(getRoomSocket(user.id));
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
                status: "online",
                profilePictureUrl:
                  "https://cdn2.iconfinder.com/data/icons/colored-simple-circle-volume-01/128/circle-flat-general-54205e542-512.png",
              }}
              customClickEvent={changeChat}
            />

            <ProfileMessage
              user={{
                id: "1",
                name: "Motomami",
                status: "online",
                profilePictureUrl:
                  "https://static3.mujerhoy.com/www/multimedia/202202/14/media/cortadas/pilar-tobella-madre-rosalia-kDDH-U160947660148ILC-624x624@MujerHoy.jpg",
              }}
              customClickEvent={changeChat}
            />

            <ProfileMessage
              user={{
                id: "2",
                name: "Motopapi",
                status: "offline",
                profilePictureUrl:
                  "https://m.media-amazon.com/images/I/914KvMZNh8L._AC_SL1500_.jpg",
              }}
              customClickEvent={changeChat}
            />
          </ul>
        </div>

        <Chat
          user={currentChatUser}
          selfUser={selfUser}
          previousMessages={pMessages}
          socket={socket}
        />
      </div>
    </>
  );
}

export default App;
