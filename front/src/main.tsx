import React from "react";
import ReactDOM from "react-dom/client";
import "./style/global.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./page/Login";
import Play from "./page/Play/Play";
import ErrorPage from "./page/ErrorPage";
import Register from "./page/Register";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider, useSelector } from "react-redux";
import { persistor, store } from "./redux/store";
import LandingPage from "./page/LandingPage";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
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
    children: [
      {
        path: "/play/single/:mode",
        element: <Play type="single" />,
      },
    ],
  },
  {
    path: "/play/multi/:room/:mode",
    element: <Play type="multi" />,
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading="null" persistor={persistor}>
        <GoogleOAuthProvider
          clientId={
            "174853657013-663iiriejk9esad3foqs0k9e604dh85v.apps.googleusercontent.com"
          }
        >
          <RouterProvider router={router} />
          {/* <ToastContainer position="bottom-right" autoClose={3000} /> */}
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
