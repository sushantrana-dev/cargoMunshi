import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Record from "./components/Record";

import Starter from "./components/Starter";
import "./index.css";
import ProtectedRoute from "./organisms/Auth/ProtectedRoute";
import { AuthProvider } from "./organisms/Auth/AuthContext";
import SomethingWentWrong from "./organisms/Auth/SomethingWentWrong";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Starter />,
      },
    ],
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/quotations",
        element: <Starter />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <ProtectedRoute><Record /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <Record />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <AuthProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
        </ErrorBoundary>
      </AuthProvider>
    </React.StrictMode>
);
