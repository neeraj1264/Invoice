// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Catologue from "./components/catologue/Catologue";
import Invoice from "./components/Invoice/Invoice";
import "./App.css";
import CustomerDetail from "./components/CustomerDetail/CustomerDetail";
const App = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Catologue setSelectedProducts={setSelectedProducts} />}
        />
        <Route
          path="/invoice"
          element={<Invoice selectedProducts={selectedProducts} />}
        />
        <Route path="/customer-detail" element={<CustomerDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
