import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/authmodule/actions";
import {
  selectIsAuthenticated,
  selectAuthDisplayName,
} from "../../features/authmodule/selectors";

export default function NavBar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const displayName = useSelector(selectAuthDisplayName);

  return (
    <nav className="navbar">
      <Link className="brand" to="/">JiraClone</Link>

      {!isAuthenticated && (
        <>
          <NavLink className="navlink" to="/login">Login</NavLink>
          <NavLink className="navlink" to="/register">Register</NavLink>
        </>
      )}

      {isAuthenticated && (
        <NavLink className="navlink" to="/dashboard">Dashboard</NavLink>
      )}

      <div className="spacer" />

      {isAuthenticated && (
        <>
          {displayName && <span className="mr-8">Hi, {displayName}</span>}
          <button
            className="btn btn-ghost"
            onClick={() => dispatch(logoutUser())}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
