import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./redux/store";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Metrics from "./pages/Metrics";
import OEE from "./pages/OEE";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Machines from "./pages/Machines";
import Reports from "./pages/Reports";
import Accidents from "./pages/Accidents";

import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/metrics",
        element: <Metrics />,
      },
      {
        path: "/oee",
        element: <OEE />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/machines",
        element: <Machines />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/accidents",
        element: <Accidents />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
