
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectAuthUser } from "../../features/authmodule/selectors";

export default function ProtectedRoute() {
  const user = useSelector(selectAuthUser);

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
