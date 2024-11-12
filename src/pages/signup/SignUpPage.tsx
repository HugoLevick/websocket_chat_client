import { FormEvent, useState } from "react";
import "../login/LoginPage.css";

function SignUpPage() {
  const [error, setError] = useState(null as null | Error);
  const [name, setName] = useState(null as null | string);
  const [password, setPassword] = useState(null as null | string);
  const [color, setColor] = useState(null as null | string);
  // const [profilePictureUrl, setProfilePictureUrl] = useState(
  //   null as null | string
  // );
  if (error) {
    alert(error.message);
    setError(null);
  }

  async function createAccount(event: FormEvent) {
    event.preventDefault();
    const url = `${import.meta.env.VITE_API_HOST}/signup`;
    const body = {
      name,
      password,
      // profilePictureUrl,
      color: color || "#000000",
    };
    try {
      const accountCreated = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (accountCreated.ok) {
        const win: Window = window;
        win.location = "/login";
      } else {
        const error = await accountCreated.json();
        setError(error.message);
      }
    } catch (error: any) {
      console.log(error);
      console.log(body);
      return setError(new Error("Usuario ya registrado"));
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
          createAccount(e);
        }}
      >
        <h3>Sign Up</h3>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Name"
          id="name"
          onChange={(e) => {
            setName(e.target.value.toLocaleLowerCase());
          }}
        />

        {/* <label htmlFor="profilePictureUrl">
          Profile Picture URL (Optional)
        </label>
        <input
          type="file"
          placeholder="Profile Picture Url"
          id="profilePictureUrl"
          onChange={(e) => {
            console.log(e.target.value);
            setProfilePictureUrl(e.target.value);
          }}
        /> */}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <label htmlFor="color">Color</label>
        <input
          type="color"
          placeholder="color"
          id="color"
          onChange={(e) => {
            setColor(e.target.value);
          }}
        />

        <button type="submit">Sign Up</button>

        <div className="signup">
          <p>
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;
