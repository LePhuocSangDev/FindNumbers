import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import ErrorPage from "./page/ErrorPage";
import Login from "./page/Login";
import Register from "./page/Register";
import Play from "./page/Play/Play";
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

export default function App() {
  return <RouterProvider router={router} />;
}
