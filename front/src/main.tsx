import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Login from "./page/Login";
import Home from "./page/Home";
import Play from "./page/Play/Play";
import ErrorPage from "./page/ErrorPage";
import Register from "./page/Register";
import { GoogleOAuthProvider } from "@react-oauth/google";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/play/single",
    element: <Play type="single" />,
  },
  {
    path: "/play/multi",
    element: <Play type="multi" />,
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="174853657013-663iiriejk9esad3foqs0k9e604dh85v.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
    ;
  </React.StrictMode>
);
