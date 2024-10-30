import { useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Loader from "./Loader";

export default function PrivateRoute() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
