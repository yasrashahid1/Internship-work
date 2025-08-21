import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/authmodule/actions";
import { selectAuthState } from "../../features/authmodule/selectors";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: ""
  });
  const [successMsg, setSuccessMsg] = useState(""); 

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const { status, error } = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.role) delete payload.role;

    const res = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(res)) {
      setSuccessMsg("✅ You have successfully registered!"); 
      setTimeout(() => nav("/dashboard"), 1500); 
    }
  }

  const isLoading = status === "loading";
  const isDisabled = isLoading;

  return (
    <form onSubmit={submit} className="form card">
      <h2>Create account</h2>

      <input
        className="input mt-16"
        placeholder="Username"
        value={form.username}
        onChange={(e) => set("username", e.target.value)}
        required
      />
      <input
        className="input mt-16"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
        required
      />
      <div className="row mt-16">
        <input
          className="input"
          placeholder="First name"
          value={form.first_name}
          onChange={(e) => set("first_name", e.target.value)}
        />
        <input
          className="input"
          placeholder="Last name"
          value={form.last_name}
          onChange={(e) => set("last_name", e.target.value)}
        />
      </div>
      <input
        className="input mt-16"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => set("password", e.target.value)}
        required
      />
      <input
        className="input mt-16"
        placeholder="Role (e.g. QA)"
        value={form.role}
        onChange={(e) => set("role", e.target.value)}
      />

      
      <button
        className="btn btn-primary mt-16"
        disabled={isDisabled}
        aria-busy={isLoading}
      >
        {isLoading ? "Creating..." : "Register"}
      </button>

      {error && <div className="error">{String(error)}</div>}
      {successMsg && <div className="success mt-16">{successMsg}</div>}
    </form>
  );
}
