import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import CustomerPage from "./pages/CustomerPage/index";
import DriverPage from "./pages/DriverPage/index";
import StorePage from "./pages/StorePage";

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="stores/:store_id" element={<StorePage />} />
        <Route path="drivers/:driver_id" element={<DriverPage />} />
        <Route path="customers/:customer_id" element={<CustomerPage />} />
        <Route path="" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
