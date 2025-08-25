import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";

import { Provider, useDispatch } from "react-redux";
import { store } from "./app/store";
import { fetchMe } from "./features/authmodule/actions";

import NavBar from "./ui/components/Navbar";
import ProtectedRoute from "./ui/components/ProtectedRoute";
import Home from "./ui/pages/Home";
import Login from "./ui/pages/Login";
import Register from "./ui/pages/Register";
import Dashboard from "./ui/pages/Dashboard";
import CardDetail from "./ui/pages/CardDetail";


function Bootstrapper({ children }) {
  const dispatch = useDispatch();
  React.useEffect(()=>{ dispatch(fetchMe()); }, [dispatch]);
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Bootstrapper>
          <NavBar />
          <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />

  <Route path="/cards/:id" element={<ProtectedRoute> <CardDetail /></ProtectedRoute>}/>
  </Route>
</Routes>
        </Bootstrapper>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
