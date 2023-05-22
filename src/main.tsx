import ReactDOM from "react-dom/client";
import ChatPage from "./ChatPage.tsx";
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
  let selfUser;
  if (jwt) {
    selfUser = await fetch(`${import.meta.env.VITE_API_HOST}/validate`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .catch(() => undefined);
  }

  const socket = getSocket(jwt);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          index
          element={<ChatPage selfUser={selfUser} socket={socket} />}
        />
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
