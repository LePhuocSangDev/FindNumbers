import React from "react";
import ReactDOM from "react-dom/client";
import "./style/global.css";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 10000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

import App from "./app";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading="null" persistor={persistor}>
        <GoogleOAuthProvider
          clientId={
            "174853657013-663iiriejk9esad3foqs0k9e604dh85v.apps.googleusercontent.com"
          }
        >
          <AlertProvider template={AlertTemplate} {...options}>
            <App />
          </AlertProvider>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
