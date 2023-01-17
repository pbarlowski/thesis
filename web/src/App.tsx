import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./redux/store";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Metrics from "./pages/Metrics";
import OEE from "./pages/OEE";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Machines from "./pages/Machines";
import OrdersReports from "./pages/OrdersReports";
import OperationsReports from "./pages/OperationsReports";
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
        path: "/orders-reports",
        element: <OrdersReports />,
      },
      {
        path: "/accidents",
        element: <Accidents />,
      },
      {
        path: "/operations-reports",
        element: <OperationsReports />,
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
