import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { UserI } from "./props/user.ts";

async function startApp() {
  const user = await new Promise<UserI>(async (res) => {
    await new Promise((res) => {
      setTimeout(() => res(true), 300);
    });

    return res({
      id: "1",
      name: "Motomami",
      status: "online",
      profilePictureUrl:
        "https://static3.mujerhoy.com/www/multimedia/202202/14/media/cortadas/pilar-tobella-madre-rosalia-kDDH-U160947660148ILC-624x624@MujerHoy.jpg",
    });
  });

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    //<React.StrictMode>
    <App selfUser={user} />
    //</React.StrictMode>
  );
}

startApp();
