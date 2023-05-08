import { FormEvent, useState } from "react";
import "./LoginPage.css";

function LoginPage() {
  const [error, setError] = useState(null as null | Error);
  const [name, setName] = useState(null as null | string);
  const [password, setPassword] = useState(null as null | string);
  if (error) alert(error.message);

  async function sendLoginRequest(event: FormEvent) {
    event.preventDefault();
    const url = `${import.meta.env.VITE_API_HOST}/login`;
    const body = {
      name,
      password,
    };
    try {
      const loggedIn = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (loggedIn.ok) {
        const data = await loggedIn.json();
        localStorage.setItem("jwt", data.token);
        const win: Window = window;
        win.location = "/";
      } else {
        const error = await loggedIn.json();
        setError(error.message);
      }
    } catch (error: any) {
      console.log(error);
      setError(new Error("Hubo un error inesperado"));
    }
  }
  return (
    <div className="login">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form
        onSubmit={(e) => {
          sendLoginRequest(e);
        }}
      >
        <h3>Login Here</h3>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Name"
          id="name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <button type="submit">Log In</button>
        <button
          type="button"
          onClick={() => {
            const win: Window = window;
            win.location = "/";
          }}
        >
          Go back
        </button>

        <div className="signup">
          <p>
            Not a user? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
