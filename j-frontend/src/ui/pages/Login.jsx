import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/authmodule/actions";
import { selectAuthState } from "../../features/authmodule/selectors";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(""); 

  const { user, status, error } = useSelector(selectAuthState);

  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav("/dashboard", { replace: true });
  }, [user, nav]);

  async function submit(e) {
    e.preventDefault();
    if (!username || !password || status === "loading") return;

    try {
      await dispatch(loginUser({ username, password })).unwrap();
      setLocalError(""); 
    } catch (err) {
      console.error("Login failed:", err);


      if (err?.detail || err?.error === "Invalid credentials") {
        setLocalError(" Incorrect username or password.");
      } else {
        setLocalError(" Login failed. Please try again.");
      }
    }
  }

  const isLoading = status === "loading";
  const isDisabled = isLoading || !username.trim() || !password.trim();

  return (
    <form onSubmit={submit} className="form card" noValidate>
      <h2>Login</h2>

      <input
        className="input mt-16"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        required
      />

      <input
        className="input mt-16"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      <button className="btn btn-primary mt-16" disabled={isDisabled}>
        {isLoading ? "Signing in..." : "Login"}
      </button>

      {(localError || error) && (
        <div className="error mt-12" role="alert">
          {localError || String(error)}
        </div>
      )}
    </form>
  );
}
