import ReactDOM from "react-dom/client";
import ChatPage from "./ChatPage.tsx";
import { UserI } from "./props/user.ts";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage.tsx";
import SignUpPage from "./pages/signup/SignUpPage.tsx";
import getSocket from "./socket.ts";

async function startApp() {
  const { jwt } = localStorage;
  if (!jwt) {
    const win: Window = window;
    win.location = "/login";
  }

  const user = await new Promise<UserI>(async (res) => {
    await new Promise((res) => {
      setTimeout(() => res(true), 300);
    });

    return res({
      id: "7",
      name: "hugo",
      profilePictureUrl:
        "https://static3.mujerhoy.com/www/multimedia/202202/14/media/cortadas/pilar-tobella-madre-rosalia-kDDH-U160947660148ILC-624x624@MujerHoy.jpg",
      color: "#000000",
    });
  });

  const socket = getSocket(jwt);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<ChatPage selfUser={user} socket={socket} />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
      </Route>
    )
  );

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    //<React.StrictMode>
    <RouterProvider router={router} />
    //</React.StrictMode>
  );
}

startApp();
